import { Settings } from './Settings';
import { Activity, activities } from './TimerData';
import { BillStatus, billStatuses } from './TimerData';

const REDMINE_BASE_URL = '/api/redmine';

interface RedmineIssue {
	issue: {
		id: number;
		subject: string;
		[key: string]: any;
	};
}

interface RedmineTimeEntry {
	id: number;
	activity: {
		id: number;
		name: string;
	};
	custom_fields: Array<{
		id: number;
		name: string;
		value: string;
	}>;
	[key: string]: any;
}

interface RedmineTimeEntriesResponse {
	time_entries: RedmineTimeEntry[];
}

interface PrefilledData {
	title?: string;
	activity?: string;
	billStatus?: string;
}

export class RedmineAPI {
	static async testApiKey(apiKey: string): Promise<boolean> {
		if (!apiKey) return false;

		try {
			console.debug('Testing Redmine API key...');
			const response = await fetch(`${REDMINE_BASE_URL}/users/current.json`, {
				headers: {
					'X-Redmine-API-Key': apiKey,
				},
			});

			console.debug(`Redmine API test response status: ${response.status}`);
			
			if (!response.ok) {
				const errorText = await response.text();
				console.error(`Redmine API test failed with status ${response.status}:`, errorText);
				return false;
			}

			const data = await response.json();
			console.debug('Redmine API test successful, user:', data.user?.login);
			return true;
		} catch (error) {
			console.error('Error testing Redmine API key:', error);
			if (error instanceof TypeError) {
				console.error('Network or CORS error - check browser console and network tab');
			}
			return false;
		}
	}

	static async getIssueData(issueId: string | number): Promise<RedmineIssue | null> {
		if (!Settings.redmineApiKey || !issueId) return null;

		try {
			const response = await fetch(`${REDMINE_BASE_URL}/issues/${issueId}.json`, {
				headers: {
					'X-Redmine-API-Key': Settings.redmineApiKey,
				},
			});

			if (!response.ok) {
				console.warn(`Redmine API error fetching issue ${issueId}: ${response.status}`);
				return null;
			}
			return await response.json() as RedmineIssue;
		} catch (error) {
			console.error('Error fetching Redmine issue:', error);
			return null;
		}
	}

	static async getTimeEntries(issueId: string | number): Promise<RedmineTimeEntry | null> {
		if (!Settings.redmineApiKey || !issueId) return null;

		try {
			const response = await fetch(
				`${REDMINE_BASE_URL}/time_entries.json?issue_id=${issueId}&user_id=me&sort=created_on:desc`,

				{
					headers: {
						'X-Redmine-API-Key': Settings.redmineApiKey,
					},
				}
			);

			if (!response.ok) {
				console.warn(`Redmine API error fetching time entries for ${issueId}: ${response.status}`);
				return null;
			}
			const data = (await response.json()) as RedmineTimeEntriesResponse;
			console.debug(`Fetched ${data.time_entries.length} time entries for issue ${issueId}`);
			
			// Return the first (most recent) time entry
			return data.time_entries.length > 0 ? data.time_entries[0] : null;
		} catch (error) {
			console.error('Error fetching Redmine time entries:', error);
			return null;
		}
	}

	static async prefillTimerData(issueId: string | number): Promise<PrefilledData> {
		const result: PrefilledData = {};
		console.debug(`Prefilling timer data for issue: ${issueId}`);

		// Get issue subject for title
		const issueData = await this.getIssueData(issueId);
		if (issueData?.issue?.subject) {
			result.title = issueData.issue.subject;
			console.debug(`Prefilled title: ${result.title}`);
		}

		// Get time entry data for activity and billable status
		const timeEntry = await this.getTimeEntries(issueId);
		if (timeEntry) {
			console.debug('Time entry found:', timeEntry);
			
			// Get activity name
			if (timeEntry.activity?.name) {
				console.debug(`Activity from Redmine: ${timeEntry.activity.name}`);
				// Find the matching activity in our list
				const matchingActivity = activities.find(
					(a) => a.activity.toLowerCase() === timeEntry.activity.name.toLowerCase()
				);
				if (matchingActivity) {
					result.activity = matchingActivity.activity;
					console.debug(`Matched activity: ${result.activity}`);
				} else {
					console.warn(`No matching activity found for: ${timeEntry.activity.name}`);
					console.warn(`Available activities:`, activities.map(a => a.activity));
				}
			}

			// Get billable status from custom fields
			if (timeEntry.custom_fields) {
				console.debug('Custom fields:', timeEntry.custom_fields);
				const billableField = timeEntry.custom_fields.find(
					(field) => field.name.toLowerCase() === 'billable status'
				);
				if (billableField && billableField.value) {
					console.debug(`Billable status from Redmine: ${billableField.value}`);
					// Find the matching bill status
					const matchingStatus = billStatuses.find(
						(status) => status.toLowerCase() === billableField.value.toLowerCase()
					);
					if (matchingStatus) {
						result.billStatus = matchingStatus;
						console.debug(`Matched billable status: ${result.billStatus}`);
					} else {
						console.warn(`No matching billable status found for: ${billableField.value}`);
						console.warn(`Available statuses:`, billStatuses);
					}
				}
			}
		} else {
			console.debug('No time entries found for this issue');
		}

		console.debug('Final prefilled data:', result);
		return result;
	}
}
