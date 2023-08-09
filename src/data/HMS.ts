import { Settings } from './Settings';

const HOURS_MILLIS = 3600000;
const MINUTES_MILLIS = 60000;
const SECONDS_MILLIS = 1000;

class HMS { 
	public time = 0;

	constructor(millis = 0) {
		this.time = millis;
	}

	static fromHumanReadable(hours = 0, minutes = 0, seconds = 0) {
		let millis = (hours * HOURS_MILLIS) + (minutes * MINUTES_MILLIS) + (seconds * SECONDS_MILLIS);

		if (isNaN(millis)) {
			millis = 0;
		}

		return new HMS(millis);
	}

	static clone(hms: HMS) {
		return new HMS(hms.getMilliseconds());
	}


	public getHours(): number {
		return Math.floor(this.time / HOURS_MILLIS);
	}

	public getMinutes(): number {
		return Math.floor((this.time - (Math.floor(this.time / HOURS_MILLIS) * HOURS_MILLIS)) / MINUTES_MILLIS);
	}

	public getSeconds(): number {
		return Math.floor((this.time - (Math.floor(this.time / MINUTES_MILLIS) * MINUTES_MILLIS)) / SECONDS_MILLIS);
	}

	public toString() {
		const hours = toTwoDigit(this.getHours());
		const minutes = toTwoDigit(this.getMinutes());
		const seconds = toTwoDigit(this.getSeconds());

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

		return HMS.fromHumanReadable(hours, minutes, seconds);
	}

	public getMilliseconds() {
		return this.time;
	}

	public updateTime(time: HMS) {
		this.time += time.getMilliseconds();
	}

	public updateTimeByMilliseconds(millis: number) {
		this.time += millis;
	}

	public reset() {
		this.time = 0;
	}

	public hasTime(): boolean {
		return this.time != 0;
	}

	public roundedTime() {
		const hours = this.getHours();
		const seconds = this.getSeconds();
		let minutes = this.getMinutes();

		if (seconds > 0) ++minutes;
		minutes += hours * 60;
		if (minutes === 0) return 0;

		// Experimental rounding
		return minToRound(minutes, Settings.roundToMinutes);

		function minToRound(m: number, r: number): number {
			return (Math.ceil(m / r) * r) / 60;
		}
	}
}

export default HMS;