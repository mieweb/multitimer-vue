import HMS from './HMS';
import { Settings } from './Settings';

export type BillStatus = 'Non-Billable' | 'Billable Time' | 'SOW Line Item' | 'MIE Goodwill (non-billable)';
export const billStatuses = ['Non-Billable', 'Billable Time', 'SOW Line Item', 'MIE Goodwill (non-billable)'];
export function isBillStatus(bsString: string): bsString is BillStatus {
	switch (bsString) {
	case 'Non-Billable':
	case 'Billable Time': 
	case 'SOW Line Item':
	case 'MIE Goodwill (non-billable)':
		return true;
	default:
		return false;
	}
}

export type Activity = 'Acct Management'
	| 'Administrative'
	| 'DB Administration'
	| 'Design'
	| 'Development'
	| 'Documentation'
	| 'Forms'
	| 'Implementation'
	| 'Layouts'
	| 'Meeting'
	| 'Project Management'
	| 'Research'
	| 'Sales'
	| 'System Administration'
	| 'Training'
	| 'Testing'
	| 'Other'
	| 'Helpdesk Support';

export type TimerId = number;

export type TimerData = {
    issue: string,
    title: string,
    time: HMS,
    link: string,
    comment: string,
    billStatus: BillStatus,
    controlsHidden: boolean,
	activity: Activity,
	lastUsed: number
};

export type FavoriteTimer = Omit<TimerData, 'time' | 'comment' | 'controlsHidden' | 'lastUsed'>;

export type RawTimerData = Omit<TimerData, 'time'> 
	& { time: { hours: number, minutes: number, seconds: number } };

/**
 * General interface for working with form data across modals.
 * `issue`, `title`, and `link` are mandatory, since they show up in any form, and 
 * any member is subject to change in accordance to this fact.
 * 
 * Note: The linter has a problem involving optional fields (like `time` or `chosen`) and `v-model`,
 * and will notify you about a potential undefined value despite it being defined. To rectify this in the linter,
 * supply an intersection where you form data lives. For example:
 * ```typescript
 * const formData: TimerForm & { chosen: boolean } = {
 *  ...
 * };
 * ...unless a better way exists to silence the linter beyond a linter ignore comment.
 * ```
 */
export function rawToTimerData(form: Partial<RawTimerData>): TimerData {
	const partial = {
		...form,
		time: HMS.fromObject(form.time || {})
	};
	return partialToTimerData(partial);
}

export function timerDataToRaw(timerData: TimerData): RawTimerData {
	return {
		title: timerData.title,
		issue: timerData.issue,
		comment: timerData.comment,
		link: timerData.link,
		billStatus: timerData.billStatus,
		activity: timerData.activity,
		controlsHidden: timerData.controlsHidden,
		lastUsed: timerData.lastUsed,
		time: {
			hours: timerData.time.hours,
			minutes: timerData.time.minutes,
			seconds: timerData.time.seconds
		},
	};
}

export function partialToTimerData(partial: Partial<TimerData>): TimerData {
	const time = partial.time ? HMS.fromObject(partial.time) : new HMS();
	return {
		issue: partial.issue?.toString() ?? '', // .toString() because this ends up being a number
		title: partial.title?.trim() ?? '',
		time: time,
		link: partial.link?.trim() ?? '',
		comment: partial.comment?.trim() || '',
		billStatus: partial.billStatus ?? 'Non-Billable' as BillStatus,
		controlsHidden: Settings.hideControls,
		activity: partial.activity ?? 'Development',
		lastUsed: partial.lastUsed ?? Date.now()
	};
}

export const activities = [
	{ activity: 'Acct Management', value: 36 },
	{ activity: 'Administrative', value: 31 },
	{ activity: 'DB Administration', value: 14 },
	{ activity: 'Design', value: 8 },
	{ activity: 'Development', value: 9 },
	{ activity: 'Documentation', value: 12 },
	{ activity: 'Forms', value: 34 },
	{ activity: 'Implementation', value: 16 },
	{ activity: 'Layouts', value: 30 },
	{ activity: 'Meeting', value: 10 },
	{ activity: 'Project Management', value: 17 },
	{ activity: 'Research', value: 11 },
	{ activity: 'Sales', value: 35 },
	{ activity: 'System Administration', value: 13 },
	{ activity: 'Training', value: 18 },
	{ activity: 'Testing', value: 33 },
	{ activity: 'Other', value: 19 },
	{ activity: 'Helpdesk Support', value: 87 }
];

export function getActivityValue(activity: string): number {
	for (const entry of activities) {
		if (entry.activity === activity) {
			return entry.value;
		}
	}

	throw new Error(`Activity with name '${activity}' does not exist`);
}