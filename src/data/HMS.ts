export default class HMS { 
    public hours = 0;
    public minutes = 0;
    public seconds = 0;

    constructor(hours?: number, minutes?: number, seconds?: number) {
        this.hours = hours || 0;
        this.minutes = minutes || 0;
        this.seconds = seconds || 0;
    }

    public toString() {
        const hours = toTwoDigit(this.hours);
        const minutes = toTwoDigit(this.minutes);
        const seconds = toTwoDigit(this.seconds);

        return `${hours}:${minutes}:${seconds}`;

        function toTwoDigit(n: number) {
            return n < 10 ? `0${n}` : `${n}`;
        }
    }

    static fromSeconds(seconds: number): HMS {
        if (seconds <= 0) return new HMS();

        seconds = Math.round(seconds);
        let hours = 0, minutes = 0;

        while (seconds >= 3600) {
            ++hours;
            seconds -= 3600;
        }

        while (seconds >= 60) {
            ++minutes;
            seconds -= 60;
        }

        return new HMS(hours, minutes, seconds);
    }

    public updateTime(time: HMS) {
        const diff = this.toSeconds() + time.toSeconds();
        let newTime = HMS.fromSeconds(diff);
        this.hours = newTime.hours;
        this.minutes = newTime.minutes;
        this.seconds = newTime.seconds;
    }

    public toSeconds() {
        return this.seconds + this.minutes * 60 + this.hours * 3600;
    }

    public reset() {
        this.hours = 0;
        this.minutes = 0;
        this.seconds = 0;
    }
};