import HMS from './HMS';

export type BillStatus = 'Non-Billable' | 'Billable Time' | 'SOW Line Item' | 'MIE Goodwill (non-billable)';

export default interface TimerInterface {
    [index: string]: any,
    issue: string,
    title: string,
    time: HMS,
    link: string,
    comment: string,
    billStatus: string,
    controlsHidden: boolean
};