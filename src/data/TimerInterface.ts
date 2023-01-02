import HMS from './HMS';
import { Settings } from './Settings';

export type BillStatus = 'Non-Billable' | 'Billable Time' | 'SOW Line Item' | 'MIE Goodwill (non-billable)';

export interface TimerInterface {
    issue: string,
    title: string,
    time: HMS,
    link: string,
    comment: string,
    billStatus: string,
    controlsHidden: boolean
}

export interface TimerJSON {
    issue: string,
    title: string,
    time: {
        hours: number,
        minutes: number,
        seconds: number
    },
    link: string,
    comment: string,
    billStatus: string,
    controlsHidden: boolean
}

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
export interface TimerForm {
    issue: string,
    title: string,
    time?: HMS,
    link: string,
    comment?: string,
    billStatus?: string,
	chosen?: boolean
}

export function partialToInterface(form: Partial<TimerInterface>): TimerInterface {
	const time = form.time ? HMS.fromObject(form.time) : new HMS();
	return {
		issue: form.issue || '',	
		title: form.title?.trim() || '',
		time: time,
		link: form.link?.trim() || '',
		comment: form.comment?.trim() || '',
		billStatus: form.billStatus || 'Non-Billable' as BillStatus,
		controlsHidden: Settings.hideControls,
	};
}

export function jsonToInterface(json: TimerJSON): TimerInterface {
	const { hours, minutes, seconds } = json.time;
	return {
		...json,
		time: new HMS(hours, minutes, seconds)
	};
}