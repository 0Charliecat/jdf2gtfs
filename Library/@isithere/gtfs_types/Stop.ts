import Timezone from 'timezone-enum';

export class Stop {

    /*
	
	Field Name			Type									Presence					Description
	stop_id				Unique ID								Required					Identifies a location: stop/platform, station, entrance/exit, generic node or boarding area (see location_type).

																							ID must be unique across all stops.stop_id, locations.geojson id, and location_groups.location_group_id values.

																							Multiple routes may use the same stop_id.
	stop_code	Text	Optional															Short text or a number that identifies the location for riders. These codes are often used in phone-based transit information systems or printed on signage to make it easier for riders to get information for a particular location. The stop_code may be the same as stop_id if it is public facing. This field should be left empty for locations without a code presented to riders.
	stop_name	Text	Conditionally Required												Name of the location. The stop_name should match the agency's rider-facing name for the location as printed on a timetable, published online, or represented on signage. For translations into other languages, use translations.txt.

																							When the location is a boarding area (location_type=4), the stop_name should contains the name of the boarding area as displayed by the agency. It could be just one letter (like on some European intercity railway stations), or text like “Wheelchair boarding area” (NYC’s Subway) or “Head of short trains” (Paris’ RER).

																							Conditionally Required:
																							- Required for locations which are stops (location_type=0), stations (location_type=1) or entrances/exits (location_type=2).
																							- Optional for locations which are generic nodes (location_type=3) or boarding areas (location_type=4).
	tts_stop_name		Text									Optional					Readable version of the stop_name. See "Text-to-speech field" in the Term Definitions for more.
	stop_desc			Text									Optional					Description of the location that provides useful, quality information. Should not be a duplicate of stop_name.
	stop_lat			Latitude								Conditionally Required		Latitude of the location.

																							For stops/platforms (location_type=0) and boarding area (location_type=4), the coordinates must be the ones of the bus pole — if exists — and otherwise of where the travelers are boarding the vehicle (on the sidewalk or the platform, and not on the roadway or the track where the vehicle stops).
														
																							Conditionally Required:
																							- Required for locations which are stops (location_type=0), stations (location_type=1) or entrances/exits (location_type=2).
																							- Optional for locations which are generic nodes (location_type=3) or boarding areas (location_type=4).
	stop_lon			Longitude								Conditionally Required		Longitude of the location.

																							For stops/platforms (location_type=0) and boarding area (location_type=4), the coordinates must be the ones of the bus pole — if exists — and otherwise of where the travelers are boarding the vehicle (on the sidewalk or the platform, and not on the roadway or the track where the vehicle stops).

																							Conditionally Required:
																							- Required for locations which are stops (location_type=0), stations (location_type=1) or entrances/exits (location_type=2).
																							- Optional for locations which are generic nodes (location_type=3) or boarding areas (location_type=4).
	zone_id				ID										Conditionally Required	Identifies the fare zone for a stop. If this record represents a station or station entrance, the zone_id is ignored.

																							Conditionally Required:
																							- Required if providing fare information using fare_rules.txt
																							- Optional otherwise.
	stop_url			URL										Optional					URL of a web page about the location. This should be different from the agency.agency_url and the routes.route_url field values.
	location_type		Enum									Optional					Location type. Valid options are:

																							0 (or blank) - Stop (or Platform). A location where passengers board or disembark from a transit vehicle. Is called a platform when defined within a parent_station.
																							1 - Station. A physical structure or area that contains one or more platform.
																							2 - Entrance/Exit. A location where passengers can enter or exit a station from the street. If an entrance/exit belongs to multiple stations, it may be linked by pathways to both, but the data provider must pick one of them as parent.
																							3 - Generic Node. A location within a station, not matching any other location_type, that may be used to link together pathways define in pathways.txt.
																							4 - Boarding Area. A specific location on a platform, where passengers can board and/or alight vehicles.
	parent_station		Foreign ID referencing stops.stop_id	Conditionally Required		Defines hierarchy between the different locations defined in stops.txt. It contains the ID of the parent location, as followed:

																							- Stop/platform (location_type=0): the parent_station field contains the ID of a station.
																							- Station (location_type=1): this field must be empty.
																							- Entrance/exit (location_type=2) or generic node (location_type=3): the parent_station field contains the ID of a station (location_type=1)
																							- Boarding Area (location_type=4): the parent_station field contains ID of a platform.

																							Conditionally Required:
																							- Required for locations which are entrances (location_type=2), generic nodes (location_type=3) or boarding areas (location_type=4).
																							- Optional for stops/platforms (location_type=0).
																							- Forbidden for stations (location_type=1).
	stop_timezone		Timezone								Optional 					Timezone of the location. If the location has a parent station, it inherits the parent station’s timezone instead of applying its own. Stations and parentless stops with empty stop_timezone inherit the timezone specified by agency.agency_timezone. The times provided in stop_times.txt are in the timezone specified by agency.agency_timezone, not stop_timezone. This ensures that the time values in a trip always increase over the course of a trip, regardless of which timezones the trip crosses.
	wheelchair_boarding	Enum									Optional					Indicates whether wheelchair boardings are possible from the location. Valid options are:

																							For parentless stops:
																							0 or empty - No accessibility information for the stop.
																							1 - Some vehicles at this stop can be boarded by a rider in a wheelchair.
																							2 - Wheelchair boarding is not possible at this stop.

																							For child stops:
																							0 or empty - Stop will inherit its wheelchair_boarding behavior from the parent station, if specified in the parent.
																							1 - There exists some accessible path from outside the station to the specific stop/platform.
																							2 - There exists no accessible path from outside the station to the specific stop/platform.

																							For station entrances/exits:
																							0 or empty - Station entrance will inherit its wheelchair_boarding behavior from the parent station, if specified for the parent.
																							1 - Station entrance is wheelchair accessible.
																							2 - No accessible path from station entrance to stops/platforms.
	level_id			Foreign ID referencing levels.level_id	Optional					Level of the location. The same level may be used by multiple unlinked stations.
	platform_code		Text									Optional					Platform identifier for a platform stop (a stop belonging to a station). This should be just the platform identifier (eg. "G" or "3"). Words like “platform” or "track" (or the feed’s language-specific equivalent) should not be included. This allows feed consumers to more easily internationalize and localize the platform identifier into other languages.

    */

	id: string;
	code?: string;
	name?: string;
	nameTTS?: string;
	description?: string;
	latitude?: number;
	longitude?: number;
	zone?: string;
	url?: 		string | URL;
	locationType: StopLocationType;
	parentStation?: string | Stop;
	timezone?: Timezone | string;
	wheelchairBoarding?: StopWheelchairBoarding;
	levelID?: string;
	platformCode?: string;

	constructor(init: 
		{ id: string; code?: string; name?: string; nameTTS?: string; description?: string; latitude?: number; longitude?: number; zone?: string; url?: string | URL; locationType: StopLocationType; parentStation?: string | Stop; timezone?: Timezone | string; wheelchairBoarding?: StopWheelchairBoarding; levelID?: string; platformCode?: string; } |
		GTFSStopObject | any
	) {

		if (init.hasOwnProperty("stop_id")) {
			this.id = String(init.stop_id);
			this.code = String(init.stop_code);
			this.name = init.stop_name;
			this.nameTTS = init.tts_stop_name;
			this.description = init.stop_desc;
			this.latitude = init.stop_lat;
			this.longitude = init.stop_lon;
			this.zone = String(init.zone_id);
			this.url = init.stop_url;
			this.locationType = init.location_type as StopLocationType;
			this.parentStation = String(init.parent_station);
			this.timezone = init.stop_timezone as Timezone;
			this.wheelchairBoarding = init.wheelchair_boarding as StopWheelchairBoarding;
			this.levelID = String(init.level_id)
			this.platformCode = String(init.platform_code);
		} else {
			this.id = init.id;
			this.code = init.code;
			this.name = init.name;
			this.nameTTS = init.nameTTS;
			this.description = init.description;
			this.latitude = init.latitude;
			this.longitude = init.longitude;
			this.zone = init.zone;
			this.url = init.url;
			this.locationType = init.locationType;
			this.parentStation = init.parentStation;
			this.timezone = init.timezone;
			this.wheelchairBoarding = init.wheelchairBoarding;
			this.levelID = init.levelID
			this.platformCode = init.platformCode;
		}

		//console.log(init.parent_station || init.parentStation)
    }

	public toJSON() {
		return {
			"stop_id": this.id,
			"stop_code": this.code ?? "",
			"stop_name": this.name ?? "",
			"tts_stop_name": this.nameTTS ?? "",
			"stop_desc": this.description ?? "",
			"stop_lat": this.latitude,
			"stop_lon": this.longitude,
			"zone_id": this.zone ?? "",
			"stop_url": String(this.url ?? ""),
			"location_type": this.locationType,
			"parent_station": String(this.parentStation),
			"stop_timezone": this.timezone ?? "",
			"wheelchair_boarding": this.wheelchairBoarding,
			"level_id": this.levelID ?? "",
			"platform_code": this.platformCode ?? ""
		}
	}

	public toString() {
		return this.id
	}

	get isChild() {
		//console.log(this.parentStation)
		return (!!this.parentStation || String(this.parentStation).length != 0)
	}
	
}

export enum StopLocationType {
	Platform		= 0,
	Station			= 1,
	Enterance		= 2,
	GenericNode		= 3,
	BoardingArea	= 4
}

export enum StopWheelchairBoarding {
	NoInformation 	= 0,
	Inherit 		= 0,
	Possible 		= 1,
	NotPossible 	= 2
}

export interface GTFSStopObject { stop_id: any, stop_code: any, stop_name: string, tts_stop_name: string, stop_desc: string, stop_lat: number, stop_lon: number, zone_id: any, stop_url: string, location_type: number, parent_station: any, stop_timezone: string, wheelchair_boarding: number, level_id: any, platform_code: any }