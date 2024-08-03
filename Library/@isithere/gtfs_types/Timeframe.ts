export class Timeframe {
    timeframeGroup: string;
    start?: string;
    end?: string;
    service: string;

    constructor(init: {
        timeframeGroup: string;
        start?: string;
        end?: string;
        service: string;
    }) {
        this.timeframeGroup = init.timeframeGroup;
        this.start = init.start;
        this.end = init.end;
        this.service = init.service;
    }

    public toJSON() {
        return {
            "timeframe_group_id": this.timeframeGroup,
            "start_time": this.start,
            "end_time": this.end,
            "service_id": this.service
        }
    }

    public toString() {
        return `${this.timeframeGroup}_${this.start}_${this.end}_${this.service}`;
    }
}
