import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Ref, reactive } from 'vue';

type MeetingPreset = 'D' | 'W' | 'M' | 'R';

export interface SettingsInterface {
    [index: string]: any,
    hideOptions: boolean
    hideControls: boolean;
    roundToMinutes: number,
    autosaveInterval: number,
    timerWidth: number,
    meetingDetectStart: string,
    meetingDetectEnd: string,
    meetingDetectPreset: MeetingPreset
}

class _Settings implements SettingsInterface {
    [index: string]: any;

    public roundToMinutes = 15;
    public hideOptions = true;
    public autosaveInterval = 30;
    public hideControls = true;
    public timerWidth = 62;
    public meetingDetectStart = format(new Date(), 'yyyy-MM-dd');
    public meetingDetectEnd = this.meetingDetectStart;
    public meetingDetectPreset = 'D' as MeetingPreset;

    public updateSettings(obj: Partial<SettingsInterface>) {
        for (const k of Object.keys(this)) {
            if (obj[k] !== undefined)
                this[k] = obj[k];
        }
    }

    public meetingDetectRange(): { startDate: string, endDate: string } {
        const current = new Date();
        const t: { [index: string]: Function } = {
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

    private YMDDate(dateString: Date): string {
        return format(new Date(), 'yyyy-MM-dd');
    }
}

export const Settings = reactive(new _Settings);