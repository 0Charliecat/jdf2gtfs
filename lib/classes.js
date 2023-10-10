const PickupType = {
    REGULAR: 0,
    NO_PICKUP: 1,
    PHONE_ARAGEMENT: 2,
    DRIVER_ARAGEMENT: 3
}


const LocationType = {
    STOP: 0,
    STATION: 1,
    ENTERANCE_EXIT: 2,
    GENERIC_NODE: 3,
    BOARDING_AREA: 4,
}

const WheelchairBoarding = {
    NO_INFORMATION: 0,
    SOME: 1,
    NOT_POSSIBLE: 2,
}

class Stop {
    /**
     * Description
     * @param {{stop_id: String,stop_code: String,stop_name: String,tts_stop_name: String,stop_desc: String,stop_lat: Number,stop_lon: Number,zone_id: String,stop_url: String,location_type: LocationType,parent_station: String|Stop,stop_timezone: String,wheelchair_boarding: wheelchair_boarding,level_id: String,platform_code: String}} e
     * @returns {Stop}
     */
    constructor(e) {
        let eExample = {
            stop_id: String,
            stop_code: String,
            stop_name: String,
            tts_stop_name: String,
            stop_desc: String,
            stop_lat: Number,
            stop_lon: Number,
            zone_id: String,
            stop_url: String,
            location_type: LocationType,
            parent_station: String || Stop,
            stop_timezone: String,
            wheelchair_boarding: WheelchairBoarding || 0,
            level_id: String,
            platform_code: String,
        }

        this.stop_id = e.stop_id;
        this.stop_code = e.stop_code || "";
        this.stop_name = e.stop_name;
        this.tts_stop_name = e.tts_stop_name || e.stop_name;
        this.stop_desc = e.stop_desc || "";
        this.stop_lat = Number(e.stop_lat); //TODO check if it is a number or not!
        this.stop_lon = Number(e.stop_lon); // TODO check if it is a number or not!
        this.zone_id = e.zone_id || "";
        this.stop_url = e.stop_url || "";
        this.location_type = (Object.values(LocationType).includes(e.location_type)) ? e.location_type : 0;
        this.parent_station = e.parent_station || "";
        this.stop_timezone = e.stop_timezone || "";
        this.wheelchair_boarding = (Object.values(WheelchairBoarding).includes(e.wheelchair_boarding)) ? e.wheelchair_boarding : 0;
        this.level_id = e.level_id || "";
        this.platform_code = e.platform_code || "";
    }

    toString() {
        return this.stop_id
    }
}

class Agency {
    constructor(e) {
        let eExample = {
            agency_id: String,
            agency_name: String,
            agency_url: String,
            agency_timezone: String,
            agency_lang: String,
            agency_phone: String,
            agency_fare_url: String,
            agency_email: String,
        }

        this.agency_id = e.agency_id
        this.agency_name = e.agency_name,
            this.agency_url = e.agency_url
        this.agency_timezone = e.agency_timezone
        this.agency_lang = e.agency_lang
        this.agency_phone = e.agency_phone
        this.agency_fare_url = e.agency_fare_url
        this.agency_email = e.agency_email
    }

    toString() {
        return this.agency_id
    }
}

const ContinuousDropOff = PickupType

const ContinuousPickup = PickupType

const RouteType = {
    TRAM: "0",
    METRO: "1",
    RAIL: "2",
    BUS: "3",
    FERRY: "4",
    CABLE_TRAM: "5",
    AREAL_LIFT: "6",
    FUNICULAR: "7",
    TROLLEYBUS: "11",
    MONORAIL: "12"
}

class Route {
    constructor(e) {
        let eExample = {
            route_id: String,
            agency_id: String,
            route_short_name: String,
            route_long_name: String,
            route_desc: String,
            route_type: RouteType,
            route_url: String,
            route_color: String,
            route_text_color: String,
            route_sort_order: String,
            continuous_pickup: ContinuousPickup,
            continuous_drop_off: ContinuousDropOff,
            network_id: String
        }

        this.route_id = e.route_id
        this.agency_id = e.agency_id
        this.route_short_name = e.route_short_name
        this.route_long_name = e.route_long_name
        this.route_desc = e.route_desc || "" // optional field
        this.route_type = (Object.values(RouteType).includes(e.route_type)) ? e.route_type : 3
        this.route_url = e.route_url || ""
        this.route_color = e.route_color || "ffffff"
        this.route_text_color = e.route_text_color || "000000"
        this.route_sort_order = e.route_sort_order || ""
        this.continuous_pickup = (Object.values(ContinuousPickup).includes(e.continuous_pickup)) ? this.continuous_pickup : 1
        this.continuous_drop_off = (Object.values(ContinuousDropOff).includes(e.continuous_drop_off)) ? this.continuous_drop_off : 1
        this.network_id = e.network_id
    }

    toString() {
        return this.route_id
    }
}

const DirectionId = {
    INBOUND: 0,
    OUTBOUND: 1,
}

const WheelchairAccessible = {
    NO_INFORMATION: 0,
    ACCESSIBLE: 1,
    NO: 2
}

const BikesAllowed = {
    NO_INFORMATION: 0,
    ACCESSIBLE: 1,
    NO: 2
}

class Trip {
    constructor(e) {
        let eExample = {
            route_id: String,
            service_id: String,
            trip_id: String,
            trip_headsign: String,
            trip_short_name: String,
            direction_id: DirectionId,
            block_id: String,
            shape_id: String,
            wheelchair_accessible: WheelchairAccessible,
            bikes_allowed: BikesAllowed
        }

        this.route_id = e.route_id
        this.service_id = e.service_id
        this.trip_id = e.trip_id
        this.trip_headsign = e.trip_headsign
        this.trip_short_name = e.trip_short_name || ""
        this.direction_id = (Object.values(DirectionId).includes(e.direction_id)) ? e.direction_id : ""
        this.block_id = e.block_id || ""
        this.shape_id = e.shape_id || ""
        this.wheelchair_accessible = (Object.values(WheelchairAccessible).includes(e.wheelchair_accessible)) ? e.wheelchair_accessible : ""
        this.bikes_allowed = (Object.values(BikesAllowed).includes(e.bikes_allowed)) ? e.bikes_allowed : ""
    }

    toString() {
        return this.trip_id
    }
}

const TimePoint = {
    APPROXIMATE: 0,
    EXACT: 1
}

class StopTimes {
    constructor(e) {
        let eExample = {
            trip_id: String,
            arrival_time: String,
            departure_time: String,
            stop_id: String,
            stop_sequence: Number,
            stop_headsign: String,
            pickup_type: PickupType,
            continuous_pickup: PickupType,
            continuous_drop_off: PickupType,
            shape_dist_traveled: Number,
            timepoint: TimePoint
        }

        this.trip_id = e.trip_id
        this.arrival_time = e.arrival_time
        this.departure_time = e.departure_time
        this.stop_id = e.stop_id
        this.stop_sequence = Number(e.stop_sequence); 
        this.stop_headsign= e.stop_headsign || ""
        this.pickup_type = (Object.values(PickupType).includes(e.pickup_type)) ? e.pickup_type : ""
        this.drop_off_type = (Object.values(PickupType).includes(e.drop_off_type)) ? e.drop_off_type : ""
        this.continuous_pickup = (Object.values(PickupType).includes(e.continuous_pickup)) ? e.continuous_pickup : ""
        this.continuous_drop_off = (Object.values(PickupType).includes(e.continuous_drop_off)) ? e.continuous_drop_off : ""
        this.shape_dist_traveled = e.shape_dist_traveled || ""
        this.timepoint = (Object.values(TimePoint).includes(e.timepoint)) ? e.timepoint : ""
    }
}

const DayService = {
    AVAILABLE: 1,
    NO_SERVICE: 0
}

class Calendar {
    constructor(e) {
        let eExample = {
            service_id: String,
            monday: DayService,
            tuesday: DayService,
            wednesday: DayService,
            thursday: DayService,
            friday: DayService, 
            saturday: DayService,
            sunday: DayService,
            start_date: String,
            end_date: String
        }

        this.service_id = e.service_id
        this.monday     = (Object.values(DayService).includes(e.monday))    ? e.monday    : 0
        this.tuesday    = (Object.values(DayService).includes(e.tuesday))   ? e.tuesday   : 0
        this.wednesday  = (Object.values(DayService).includes(e.wednesday)) ? e.wednesday : 0
        this.thursday   = (Object.values(DayService).includes(e.thursday))  ? e.thursday  : 0
        this.friday     = (Object.values(DayService).includes(e.friday))    ? e.friday    : 0
        this.saturday   = (Object.values(DayService).includes(e.saturday))  ? e.saturday  : 0
        this.sunday     = (Object.values(DayService).includes(e.sunday))    ? e.sunday    : 0
        this.start_date = e.start_date
        this.end_date   = e.end_date
    }
}

const ExceptionType = {
    ADDED_SERVICE: "1",
    REMOVED_SERVICE: "2"
}

class CalendarDate {
    constructor(e) {
        let eExample = {
            service_id: String,
            date: String,
            exception_type: ExceptionType
        }
        this.service_id     = e.service_id
        this.date           = e.date
        this.exception_type = (Object.values(ExceptionType).includes(e.exception_type))    ? e.exception_type    : 2
    }
}

class FeedInfo {
    constructor(e) {
        let eExample = {
            feed_publisher_name: String,
            feed_publisher_url: String,
            feed_lang: String,
            default_lang: String,
            feed_start_date: String,
            feed_end_date: String,
            feed_version: String,
            feed_contact_email: String,
            feed_contact_url: String,
        }

        this.feed_publisher_name = e.feed_publisher_name
        this.feed_publisher_url = e.feed_publisher_url
        this.feed_lang = e.feed_lang || "mul"
        this.default_lang = e.default_lang || ""
        this.feed_start_date = e.feed_start_date || ""
        this.feed_end_date = e.feed_end_date || ""
        this.feed_version = e.feed_version || ""
        this.feed_contact_email = e.feed_contact_email || ""
        this.feed_contact_url = e.feed_contact_url || ""
    }
}

module.exports = { PickupType, Stop, Agency, Route, RouteType, Trip, StopTimes, TimePoint, Calendar, CalendarDate, FeedInfo }