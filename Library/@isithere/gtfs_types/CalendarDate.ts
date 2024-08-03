export class CalendarDate {

    service: string;
    date: Date;
    exception: CalendarDateExcpetion;

    constructor(init: {
        service: string;
        date: Date;
        exception: CalendarDateExcpetion;
    }) {
        this.service = init.service
        this.date = init.date
        this.exception = init.exception
    }

    public toJSON() {
        return {
            service_id: this.service,
            date: this.date,
            exception_type: this.exception
        }
    }
}

export enum CalendarDateExcpetion {
    Added = 1,
    Removed = 2
}