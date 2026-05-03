/// # Linky
/// The Linky file contains exactly one record for each route. 
/// Different versions of the same line (timetables with different validity) must be distinguished in the `Rozlišení linky` field. 
/// If the `Seskupení spojů` flag is set, then each route must contain a relationship to the `SpojSkup`. 
/// If the `Použití označníků` flag is set, then each stop in the `Zasspoje` must contain a relationship to a `Oznacovnik`.
///
/// | field name			| description of the field					| data format		|
/// |-----------------------|-------------------------------------------|-------------------|
/// | Číslo linky			| - required text							| DbString (6)		|
/// | Název linky 			| - required text							| DbString (254)	|
/// | IČ dopravce 			| - required text, relation to Dopravci		| DbString (10)		|
/// | Typ linky				| - required text, see `TypLinky`			| DbString (1)		|
/// | Dopravní prostředek	| - required text, see `DopravnyProstriedok`| DbString (1)		|
/// | Výlukový JŘ 			| - required boolean						| Bit				|
/// | Seskupení spojů		| - required boolean						| Bit				|
/// | Použití označníků 	| - required boolean						| Bit				|
/// | Jednosměrný JŘ 		| - required boolean						| Bit				|
/// | Rezerva				| - optional text							| DbString (5)		|
/// | Číslo licence 		| - optional text							| DbString (48)		|
/// | Platnost lic. od 		| - optional date							| DbDate			|
/// | Platnost lic. do 		| - optional date							| DbDate			|
/// | Platnost JŘ od 		| - required date							| DbDate			|
/// | Platnost JŘ do 		| - required date							| DbDate			|
/// | Rozlišení dopravce 	| - required number							| DbLong			|
/// | Rozlišení linky		| - required number							| DbLong			|
///
/// ## Translated field names
/// - `Číslo linky` => `number`
/// - `Název linky` => `name`
/// - `IČ dopravce` => `agencyID`
/// - `Typ linky` => `routingType`
/// - `Dopravní prostředek` => `vehicleType`
/// - `Výlukový JŘ` => `isSubstitute`
/// - `Seskupení spojů` => `isGrouped`
/// - `Použití označníků` => `usesPlatforms`
/// - `Jednosměrný JŘ` => `isOneWay`
/// - `Rezerva` => `reserved1`
/// - `Číslo licence` => `licenseNumber`
/// - `Platnost lic. od` => `licenseValidFrom`
/// - `Platnost lic. do` => `licenseValidUntil`
/// - `Platnost JŘ od` => `validFrom`
/// - `Platnost JŘ do` => `validUntil`
/// - `Rozlišení dopravce` => `agencyResolution`
/// - `Rozlišení linky` => `lineResolution`

import { BiteBoolean, DDMMYYYY } from "./universal"

/// Reference to a `Linka`
/// also a `route_short_name` equivalent in GTFS
type LineNumber = string

/// Reference to a `Linka` (alternative ID)
type LineResolution = number

/// Routing Type of a line
/// - `A` => `Urban`
/// - `B` => `Urban with suburban service`
/// - `N` => `International - without national service`
/// - `P` => `International - with national service`
/// - `V` => `National - within region`
/// - `Z` => `National - between regions`
/// - `D` => `National - long distance`
export enum TypLinky {
	Urban = "A",
	UrbanWithSuburbanService = "B",
	InternationalWithoutNationalService = "N",
	InternationalWithNationalService = "P",
	NationalWithinRegion = "V",
	NationalBetweenRegions = "Z",
	NationalLongDistance = "D"
}

/// Vehicle Type of a line
/// - `A` => Bus
/// - `E` => Tram/Light Rail
/// - `L` => Cable Car
/// - `M` => Metro
/// - `P` => Ferry/Ship
/// - `T` => Trolleybus
export enum DopravnyProstriedok {
	Bus = "A",
	Tram = "E",
	CableCar = "L",
	Metro = "M",
	Ferry = "P",
	Trolleybus = "T"
}

export interface Linky {
	number:				LineNumber
	name:				string
	agencyID:			string
	routingType:		TypLinky
	vehicleType:		DopravnyProstriedok
	isSubstitute:		BiteBoolean
	isGrouped:			BiteBoolean
	usesPlatforms:		BiteBoolean
	isOneWay:			BiteBoolean
	reserved1?:			string
	licenseNumber?:		string
	licenseValidFrom?:	DDMMYYYY
	licenseValidUntil?:	DDMMYYYY
	validFrom:			DDMMYYYY
	validUntil:			DDMMYYYY
	agencyResolution:	string
	lineResolution:		LineResolution
}

export const headers = [
	"number",
	"name",
	"agencyID",
	"routingType",
	"vehicleType",
	"isSubstitute",
	"isGrouped",
	"usesPlatforms",
	"isOneWay",
	"reserved1",
	"licenseNumber",
	"licenseValidFrom",
	"licenseValidUntil",
	"validFrom",
	"validUntil",
	"agencyResolution",
	"lineResolution",
]