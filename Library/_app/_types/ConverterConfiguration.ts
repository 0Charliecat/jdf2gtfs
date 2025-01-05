import { GTFSFeedInfoObject } from "@isithere/gtfs";
import { RouteVehicleType } from "@isithere/gtfs";
import { LongitudeLatitude, Timezone, LanguageCode, HexCodeColor, Year } from "./Simples";

export interface Configuration {
	path: string; 
	output?: string;
	stop_ids?: { [ZastavkaID: string]: string };
	id_prefix?: string;
	locations: { [ZastavkaID: string]: LongitudeLatitude };
	platforms: {parent: string; code: string | number; location: LongitudeLatitude }[];
	timezone?: Timezone;
	lang?: LanguageCode;
	line_number_change?: { [LinkaID: string ]: string };
	line_colors?: { [LinkaID: string]: {background: HexCodeColor; foreground: HexCodeColor} };
	years?: Year[];
	line_route_type_override?: { [LinkaID: string]: RouteVehicleType };
	feed_info: GTFSFeedInfoObject;
}