import { PublicClientApplication, AuthenticationResult } from '@azure/msal-browser';
import { Settings } from './Settings';

export interface MeetingData {
    issue: string,
    title: string,
    start: string,
    end: string,
    link: string    
}
// Not complete data, used for typing.
interface RawMeetingData {
	subject: string,
	start: {
		dateTime: string,
	},
	end: {
		dateTime: string
	},
	location: {
		displayName: string
	}
}

const locationString = location.toString();
const redirect = locationString.endsWith('index.html')
	? locationString
	: locationString + 'index.html'; // This may need to be changed
const loginRequest = {
	scopes: ['user.read', 'calendars.read'],
};
const msalConfig = {
	auth: {
		clientId: '2fb708ba-5805-401a-9c69-b1f65f93208e',
		authority:
            'https://login.microsoftonline.com/b02da655-019b-4282-9490-530ed9153fc8/',
		redirectUri: redirect,
		// "http://localhost:5173/index.html",
	},
};
const msalInstance = new PublicClientApplication(msalConfig);

export async function importMeetings() {
	return await msalInstance
		.acquireTokenSilent(loginRequest)
		.then(getToken)
		.catch(() => {
			return msalInstance.loginPopup(loginRequest).then(getToken);
		});

	async function getToken(resData: AuthenticationResult) {
		const token = resData.accessToken;
		const headers = new Headers();
		const bearer = 'Bearer ' + token;
		headers.append('Authorization', bearer);
		const options = {
			method: 'GET',
			headers: headers,
		};
		const dateRange = Settings.meetingDetectRange();
		if (!dateRange) return [];

		const startDate = dateRange.startDate + 'T00:00:00.000Z';
		const endDate = dateRange.endDate + 'T23:59:59.999Z';

		const graphEndpoint = `https://graph.microsoft.com/v1.0/me/calendarview?startdatetime=${startDate}&enddatetime=${endDate}&$select=subject,body,start,end,location&$search="%23"`;
		const meetingData: MeetingData[] = [];
		let nextLink = graphEndpoint;
		while (nextLink) {
			const { pagedMeetings, link } = await fetch(nextLink, options)
				.then((res) => res.json())
				.then((json) => {
					const meetingData = json.value;
					const link = json['@odata.nextLink'];
					const pagedMeetings = composeMeetingData(meetingData);
					return {
						pagedMeetings,
						link,
					};
				});
			for (const pagedMeeting of pagedMeetings) {
				meetingData.push(pagedMeeting);
			}
			nextLink = link;
		}
		return meetingData;
	}

	function composeMeetingData(rawDataCollection: RawMeetingData[]): MeetingData[] {
		const meetingData: MeetingData[] = [];
		const r = /#\d+/;

		for (const rawData of rawDataCollection) {
			const matches = rawData.subject.match(r);
			if (!matches) continue;

			meetingData.push({
				issue: matches[0].substring(1),
				title: rawData.subject.replace(matches[0], '').trim(),
				start: rawData.start.dateTime + 'Z',
				end: rawData.end.dateTime + 'Z',
				link: rawData.location.displayName
			});
		}
		return meetingData;
	}
}