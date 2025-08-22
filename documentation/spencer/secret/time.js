
export var deltaTime = 0.1;

export const Time = {
    second: 0,
    minute: 0,
    hour: 0,
    day: 0,
    month: 0,
    year: 0,
    allTime: 0,
    update: function() {
        this.allTime += deltaTime;
        this.second += deltaTime;
        if (this.second >= 60) {
            this.second = 0;
            this.minute++;
            if (this.minute >= 60) {
                this.minute = 0;
                this.hour++;
                if (this.hour >= 24) {
                    this.hour = 0;
                    this.day++;
                    if (this.day > 30) {
                        this.day = 1;
                        this.month++;
                        if (this.month > 12) {
                            this.month = 1;
                            this.year++;
                        }
                    }
                }
            }
        }
    }
};

export function resetTime() {
    Time.second = 0;
    Time.minute = 0;
    Time.hour = 0;
    Time.day = 0;
    Time.month = 0;
    Time.year = 0;
    Time.allTime = 0;
};