import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { reactive } from 'vue';
import { getStorage } from './Save';

type MeetingPreset = 'D' | 'W' | 'M' | 'R';
type StartEndDate = {
	startDate: string,
	endDate: string
};

export interface SettingsInterface {
	[index: string]: unknown;
    hideOptions: boolean
    hideControls: boolean;
    roundToMinutes: number,
    autosaveInterval: number,
    timerWidth: number,
    meetingDetectStart: string,
    meetingDetectEnd: string,
    meetingDetectPreset: MeetingPreset,
	darkMode: boolean
}

class _Settings implements SettingsInterface {
	[index: string]: unknown;
	public roundToMinutes = 15;
	public hideOptions = true;
	public autosaveInterval = 30;
	public hideControls = true;
	public timerWidth = 62;
	public meetingDetectStart = format(new Date(), 'yyyy-MM-dd');
	public meetingDetectEnd = this.meetingDetectStart;
	public meetingDetectPreset: MeetingPreset = 'D';
	
	// "External" settings
	public darkMode = false;

	public updateSettings(obj: Partial<SettingsInterface>) {
		for (const k of Object.keys(this)) {
			if (obj[k] !== undefined)
				this[k] = obj[k];
		}

		// Post function calls
		if (obj.autosaveInterval !== undefined) {
			getStorage().setAutosave(this.autosaveInterval);
		}

		if (obj.darkMode !== undefined) {
			this.refreshDarkMode();
		}
	}

	public dataCopy(): SettingsInterface {
		return {
			...this
		};
	}

	public meetingDetectRange(): StartEndDate {
		const current = new Date();
		const t: { [index: string]: () => StartEndDate } = {
			D: () => {
				const cs = this.YMDDate(new Date());
				return {
					startDate: cs,
					endDate: cs,
				};
			},
			W: () => {
				const start = startOfWeek(current, { weekStartsOn: 1 });
				const end = endOfWeek(current, { weekStartsOn: 1 });
				return {
					startDate: this.YMDDate(start),
					endDate: this.YMDDate(end),
				};
			},
			M: () => {
				const start = startOfMonth(current);
				const end = endOfMonth(current);
				return {
					startDate: this.YMDDate(start),
					endDate: this.YMDDate(end),
				};
			},
			R: () => {
				return {
					startDate: this.meetingDetectStart,
					endDate: this.meetingDetectEnd,
				};
			},
		};

		return t[this.meetingDetectPreset]();
	}

	public toggleDarkMode() {
		this.darkMode = !this.darkMode;
		this.refreshDarkMode();
	}

	private refreshDarkMode() {
		const bodyClassList = document.querySelector('body')?.classList;
		if (!bodyClassList) return;

		if (this.darkMode) {
			bodyClassList.add('dark');
		} else {
			bodyClassList.remove('dark');
		}
	}

	private YMDDate(date: Date): string {
		return format(date, 'yyyy-MM-dd');
	}
}

export const Settings = reactive(new _Settings);