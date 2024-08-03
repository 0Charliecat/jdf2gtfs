export class Trip {
    id: string;
    service: string;
    route: string;
    headsign?: string;
    shortName?: string;
    direction?: TripDirection;
    block?: string;
    shape?: string;
    wheelchairAccessible?: TripWheelchairAccessibility;
    bikesAllowed?: TripBikesAllowed;

    constructor(init: {
        id: string;
        service: string;
        route: string;
        headsign?: string;
        shortName?: string;
        direction?: TripDirection;
        block?: string;
        shape?: string;
        wheelchairAccessible?: TripWheelchairAccessibility;
        bikesAllowed?: TripBikesAllowed;
    } | GTFSTripObject | any) {
        if (init.hasOwnProperty('id')) {
            this.id = init.id;
            this.service = init.service;
            this.route = init.route;
            this.headsign = init.headsign;
            this.shortName = init.shortName;
            this.direction = init.direction;
            this.block = init.block;
            this.shape = init.shape;
            this.wheelchairAccessible = init.wheelchairAccessible;
            this.bikesAllowed = init.bikesAllowed;
        } else {
            this.id = init.trip_id;
            this.service = init.service_id;
            this.route = init.route_id;
            this.headsign = init.trip_headsign;
            this.shortName = init.trip_short_name;
            this.direction = init.direction_id;
            this.block = init.block_id;
            this.shape = init.shape_id;
            this.wheelchairAccessible = init.wheelchair_accessible;
            this.bikesAllowed = init.bikes_alowed;
        }
    }

    public toJSON() {
        return {
            "route_id": this.route,
            "service_id": this.service,
            "trip_id": this.id,
            "trip_headsign": this.headsign,
            "trip_short_name": this.shortName,
            "direction_id": this.direction,
            "block_id": this.block,
            "shape_id": this.shape,
            "wheelchair_accessible": this.wheelchairAccessible,
            "bikes_allowed": this.bikesAllowed
        }
    }

    public toString() {
        return this.id;
    }
}

export enum TripDirection {
    Outbound = 0,
    Inbound = 1
}

export enum TripWheelchairAccessibility {
    NoInformation = 0,
    Some = 1,
    NotAllowed = 2
}

export enum TripBikesAllowed {
    NoInformation = 0,
    Allowed = 1,
    NotAllowed = 2
}

export interface GTFSTripObject {
    route_id: string;
    service_id: string;
    trip_id: string;
    trip_headsign: string;
    trip_short_name: string;
    direction_id: TripDirection;
    block_id: string;
    shape_id: string;
    wheelchair_accessible: TripWheelchairAccessibility;
    bikes_allowed: TripBikesAllowed;
}