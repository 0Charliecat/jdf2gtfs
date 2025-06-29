import { Agency, Route, Stop, Trip, StopTime, Calendar, CalendarDate } from "@isithere/gtfs"
import { Zastavky } from "../../@isithere/jdf_types/Zastavky"
import { Dopravci } from "../../@isithere/jdf_types/Dopravci"
import { CustomPlatform } from "./CustomPlatform"
import { Linky } from "../../@isithere/jdf_types/Linky"
import { Spoje } from "../../@isithere/jdf_types/Spoje"
import { Zasspoje } from "../../@isithere/jdf_types/Zasspoje"
import { CasKody } from "../../@isithere/jdf_types/CasKody"

export interface RequestGTFSEntityChanges {
	Stops: (value: { gtfs: Stop, jdf: Zastavky } | { gtfs: Stop, platform: CustomPlatform }) => Partial<Stop> | false
	Agencies: (value: { gtfs: Agency, jdf: Dopravci }) => Partial<Agency> | false
	Routes: (value: { gtfs: Route, jdf: Linky }) => Partial<Route> | false
	Trips: (value: { gtfs: Trip, jdf: Spoje }) => Partial<Trip> | false
	StopTimes: (value: { gtfs: StopTime, jdf: Zasspoje }) => Partial<StopTime> | false
	Calendars: (value: { gtfs: Calendar, jdf: Spoje }) => Partial<Calendar> | false
	CalendarDates: (value: { gtfs: CalendarDate, jdf: CasKody }) => Partial<CalendarDate> | false
}