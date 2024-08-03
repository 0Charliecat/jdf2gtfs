export class StopTime {
    trip: string;
    arrival?: string;
    departure?: string;
    stop?: string;
    locationGroup?: string;
    location?: string;
    stopSequence: number;
    headsign?: string;
    startPickupDropOffWindow?: string;
    endPickupDropOffWindow?: string;
    pickUp?: StopTimePickDrop;
    dropOff?: StopTimePickDrop;
    continuousPickUp?: StopTimeContinuous;
    continuousDropOff?: StopTimeContinuous;
    shapeDististanceTraveled?: number;
    timepoint?: Timepoint;
    pickup_booking_rule?: string;
    drop_off_booking_rule?: string;

    constructor(init: {
        trip: string;
        arrival?: string;
        departure?: string;
        stop?: string;
        locationGroup?: string;
        location?: string;
        stopSequence: number;
        headsign?: string;
        startPickupDropOffWindow?: string;
        endPickupDropOffWindow?: string;
        pickUp?: StopTimePickDrop;
        dropOff?: StopTimePickDrop;
        continuousPickUp?: StopTimeContinuous;
        continuousDropOff?: StopTimeContinuous;
        shapeDististanceTraveled?: number;
        timepoint?: Timepoint;
        pickup_booking_rule?: string;
        drop_off_booking_rule?: string;
    }) {
        this.trip = init.trip;
        this.arrival = init.arrival;
        this.departure = init.departure;
        this.stop = init.stop;
        this.locationGroup = init.locationGroup
        this.location = init.location;
        this.stopSequence = init.stopSequence;
        this.headsign = init.headsign;
        this.startPickupDropOffWindow = init.startPickupDropOffWindow;
        this.endPickupDropOffWindow = init.endPickupDropOffWindow;
        this.pickUp = init.pickUp;
        this.dropOff = init.dropOff;
        this.continuousPickUp = init.continuousPickUp;
        this.continuousDropOff = init.continuousDropOff;
        this.shapeDististanceTraveled = init.shapeDististanceTraveled;
        this.timepoint = init.timepoint;
        this.pickup_booking_rule = init.pickup_booking_rule;
        this.drop_off_booking_rule = init.drop_off_booking_rule;
    }

    public toJSON() {
        return {
            "trip_id": this.trip,
            "arrival_time": this.arrival,
            "departure_time": this.departure,
            "stop_id": this.stop,
            "location_group_id": this.locationGroup,
            "location_id": this.location,
            "stop_sequence": this.stopSequence,
            "stop_headsign": this.headsign,
            "start_pickup_drop_off_window": this.startPickupDropOffWindow,
            "end_pickup_drop_off_window": this.endPickupDropOffWindow,
            "pickup_type": this.pickUp,
            "drop_off_type": this.dropOff,
            "continuous_pickup": this.continuousPickUp,
            "continuous_drop_off": this.continuousDropOff,
            "shape_dist_traveled": this.shapeDististanceTraveled,
            "timepoint": this.timepoint,
            "pickup_booking_rule_id": this.pickup_booking_rule,
            "drop_off_booking_rule_id": this.drop_off_booking_rule
        }
    }

    public toString() {
        return `${this.trip}_${this.stopSequence}`;
    }
}

export enum StopTimePickDrop {
    Regular = 0,
    NoStop = 1,
    PhoneAgency = 2,
    CoordinateDriver = 3
}


export enum StopTimeContinuous {
	Continuous = 0,
	NoContinuous = 1,
	PhoneAgency = 2,
	DriverArrangement = 3
}

export enum Timepoint {
    Approximate = 0,
    Exact = 1
}
