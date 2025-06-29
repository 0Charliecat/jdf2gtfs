import { GTFSFeedInfoObject, RouteVehicleTypeExtended, RouteVehicleType } from "@isithere/gtfs";
import { LongitudeLatitude, Timezone, LanguageCode, HexCodeColor, Year } from "./Simples";
import { JDFFileProvider } from "../../lib@FileProvider/_types/FileProviderTypes";
import { CustomPlatform } from "./CustomPlatform";
import { RequestGTFSEntityChanges } from "./RequestEntityChanges";
import { FeatureFlags } from "./FeatureFlags";

export interface Configuration {
	fileProvider: Required<JDFFileProvider>
	id_prefix?: string;
	platforms: CustomPlatform[];
	locations: { [key: string]: LongitudeLatitude };
	requestEntityChanges?: Partial<RequestGTFSEntityChanges>;
	lineColors: { 
		[key: string]: { background: HexCodeColor; foreground: HexCodeColor }, 
		default: { background: HexCodeColor; foreground: HexCodeColor } 
	};
	feed_info?: Partial<GTFSFeedInfoObject>;
		
	stop_ids?: { [key: string]: string };
	stop_codes?: { [key: string]: string };
	timezone?: Timezone;
	// lang: LanguageCode;
	
	lineNumberChanges?: { [key: string]: string };
	
	overrides?: Partial<GeneratorOverrides>
	
	featureFlags?: Partial<FeatureFlags>
}


export interface GeneratorOverrides {
	Route: Partial<{
		ShortName: { [key: string]: string },
		Type: { [key: string]: RouteVehicleType | RouteVehicleTypeExtended }
	}>
}

export interface GeneratorOverridesMap {
	Route: {
		ShortName: Map<string, string>,
		Type: Map<string, RouteVehicleType | RouteVehicleTypeExtended>
	}
}