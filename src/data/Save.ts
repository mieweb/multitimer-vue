import HMS from './HMS';
import { Settings, SettingsInterface } from './Settings';
import TimerInterface from './TimerInterface';
import { TimerSystem } from './TimerSystem';

export interface SaveData {
    timers: {
        timerData: TimerInterface
    }[],
    settings: SettingsInterface
}

interface Save {
    save(): void;
    load(): void;
}

class LocalStorage implements Save {
    save() {
        const timers = [];
        const settings = { ...Settings };

        for (const timer of TimerSystem.map().values()) {
            timers.push({ 
                timerData: timer
            });
        }

        localStorage.setItem('timers', JSON.stringify(timers));
        localStorage.setItem('settings', JSON.stringify(settings));
    }

    load() {
        const timers = JSON.parse(localStorage.getItem('timers')!);
        const settings: SettingsInterface = JSON.parse(localStorage.getItem('settings')!);

        for (const timer of timers) {
            const { hours, minutes, seconds } = timer.timerData.time
            timer.timerData.time = new HMS(hours, minutes, seconds);
            TimerSystem.addTimer(timer.timerData);
        }
        Settings.updateSettings(settings);
    }
}

// class ServerStorage implements Save {

// }

export function getStorage() {
    return new LocalStorage();
}
