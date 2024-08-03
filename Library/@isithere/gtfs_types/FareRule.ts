export class FareRule {
    fare: string;
    route?: string;
    origin?: string;
    destination?: string;
    contains?: string;

    constructor(init: {
        fare: string;
        route?: string;
        origin?: string;
        destination?: string;
        contains?: string;
    }) {
        this.fare = init.fare;
        this.route = init.route;
        this.origin = init.origin;
        this.destination = init.destination;
        this.contains = init.contains;
    }

    public toJSON() {
        return {
            "fare_id": this.fare,
            "route_id": this.route,
            "origin_id": this.origin,
            "destination_id": this.destination,
            "contains_id": this.contains
        }
    }

    public toString() {
        return `${this.fare}_${this.route}_${this.origin}_${this.destination}_${this.contains}`;
    }
}
