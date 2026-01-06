import HMS from "./HMS";
import { Settings } from "./Settings";

export type BillStatus =
  | "Billable Time"
  | "Feature"
  | "Goodwill-Leadership Approved"
  | "Goodwill-Rep"
  | "Holiday"
  | "Internal Meeting"
  | "Non-Billable Admin/Other(mgr approved only)"
  | "Non-Billable-Bug/Defect"
  | "Non-Billable-Training/Education"
  | "Non-Billable-Research/Helpdesk"
  | "PTO"
  | "SOW Line Item";
export const billStatuses = [
  "Non-Billable Admin/Other(mgr approved only)",
  "Non-Billable-Bug/Defect",
  "Non-Billable-Training/Education",
  "Non-Billable-Research/Helpdesk",
  "Billable Time",
  "Feature",
  "Goodwill-Leadership Approved",
  "Goodwill-Rep",
  "Holiday",
  "Internal Meeting",
  "PTO",
  "SOW Line Item",
];
export function isBillStatus(bsString: string): bsString is BillStatus {
  return billStatuses.includes(bsString);
}

export type Activity =
  | "Acct Management"
  | "Administrative"
  | "DB Administration"
  | "Design"
  | "Development"
  | "Documentation"
  | "Forms"
  | "Implementation"
  | "Layouts"
  | "Meeting"
  | "Project Management"
  | "Research"
  | "Sales"
  | "System Administration"
  | "Training"
  | "Testing"
  | "Other"
  | "Helpdesk Support"
  | "Holiday";

export type TimerId = number;

export type TimerData = {
  issue: string;
  title: string;
  time: HMS;
  link: string;
  comment: string;
  billStatus: BillStatus;
  controlsHidden: boolean;
  activity: Activity;
  lastUsed: number;
};

export type FavoriteTimer = Omit<
  TimerData,
  "time" | "comment" | "controlsHidden" | "lastUsed"
>;

export type RawTimerData = Omit<TimerData, "time"> & {
  time: { hours: number; minutes: number; seconds: number };
};

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
    time: HMS.fromHumanReadable(
      form.time?.hours,
      form.time?.minutes,
      form.time?.seconds
    ),
  } as Partial<TimerData>;
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
      hours: timerData.time.getHours(),
      minutes: timerData.time.getMinutes(),
      seconds: timerData.time.getSeconds(),
    },
  };
}

export function partialToTimerData(partial: Partial<TimerData>): TimerData {
  const time = partial.time ? HMS.clone(partial.time) : new HMS();
  return {
    issue: partial.issue?.toString() ?? "", // .toString() because this ends up being a number
    title: partial.title?.trim() ?? "",
    time: time,
    link: partial.link?.trim() ?? "",
    comment: partial.comment?.trim() || "",
    billStatus:
      partial.billStatus ??
      ("Non-Billable Admin/Other(mgr approved only)" as BillStatus),
    controlsHidden: Settings.hideControls,
    activity: partial.activity ?? "Development",
    lastUsed: partial.lastUsed ?? Date.now(),
  };
}

export const activities = [
  { value: 36, activity: "Acct Management" },
  { value: 9, activity: "Development" },
  { value: 16, activity: "Implementation/Support" },
  { value: 17, activity: "Project Management" },
  { value: 33, activity: "Testing" },
  { value: 2483, activity: "Holiday" },
  { value: 31, activity: "Administrative" },
  { value: 14, activity: "DB Administration" },
  { value: 8, activity: "Design" },
  { value: 12, activity: "Documentation" },
  { value: 34, activity: "Forms" },
  { value: 30, activity: "Layouts" },
  { value: 10, activity: "Meeting" },
  { value: 11, activity: "Research" },
  { value: 35, activity: "Sales" },
  { value: 13, activity: "System Administration" },
  { value: 18, activity: "Training" },
  { value: 19, activity: "Other" },
  { value: 87, activity: "Helpdesk Support" },
  { value: 2916, activity: "General Support/Admin" },
];

export function getActivityValue(activity: string): number {
  for (const entry of activities) {
    if (entry.activity === activity) {
      return entry.value;
    }
  }

  throw new Error(`Activity with name '${activity}' does not exist`);
}

export function findActivityValue(activity: string): number | null {
  for (const entry of activities) {
    if (entry.activity === activity) return entry.value;
  }
  return null;
}
