/// # Zasspoje
/// The Zasspoje file contains a list of stops of all lines in the feed. Each stop of a trip has exactly one record.
///
/// | field name			| description of the field					| data format		|
///	|-----------------------|-------------------------------------------|-------------------|
/// | Čislo linky			| - required number, dependant on Linka		| DbLong			|
/// | Číslo spoje			| - required number							| DbLong			|
/// | Číslo tarifní			| - required number							| DbLong			|
/// | Číslo zastávky		| - required number							| DbLong			|
/// | Kód označníku			| - required number, dependant on Označník	| DbString(5)		|
/// | Číslo stanoviště		| - optional text							| DbString(48)		|
/// | Pev. kód 1			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 2			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 3			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Kilometry				| - required number							| DbLong			|
/// | Čas příjezdu			| - required number							| DbString (5)		|
/// | Čas odjezdu			| - required number							| DbString (5)		|
/// | Čas příjezdu min.		| - required number							| DbString (5)		|
/// | Čas příjezdu max.		| - required number							| DbString (5)		|
/// | Rozlišení linky		| - required number, dependant on SpojSkup	| DbLong			|
///
/// ## Translated field names
/// - `Čislo linky` => `lineNumber`
/// - `Číslo spoje` => `tripNumber`
/// - `Číslo tarifní` => `tariffNumber`
/// - `Číslo zastávky` => `stopId`
/// - `Kód označníku` => `platformId`
/// - `Číslo stanoviště` => `platformCode`
/// - `Pev. kód 1` => `pk_1`
/// - `Pev. kód 2` => `pk_2`
/// - `Pev. kód 3` => `pk_3`
/// - `Kilometry` => `kilometers`
/// - `Čas příjezdu` => `arrivalTime`
/// - `Čas odjezdu` => `departureTime`
/// - `Čas příjezdu min.` => `arrivalTimeMin`
/// - `Čas příjezdu max.` => `arrivalTimeMax`
/// - `Rozlišení linky` => `lineResolution`

type ZasSpojeTime = string | "|" | "<" | ""

export interface Zasspoje {
	lineNumber: string

	tripNumber: string

	tariffNumber: string

	stopId: string

	platformId: string

	platformCode: string

	pk_1: string

	pk_2: string

	pk_3: string

	kilometers: string

	arrivalTime: ZasSpojeTime

	departureTime: ZasSpojeTime

	arrivalTimeMin: ZasSpojeTime

	arrivalTimeMax: ZasSpojeTime

	lineResolution: string
}

export const headers = [
	"lineNumber",
	"tripNumber",
	"tariffNumber",
	"stopId",
	"platformId",
	"platformCode",
	"pk_1",
	"pk_2",
	"pk_3",
	"kilometers",
	"arrivalTime",
	"departureTime",
	"arrivalTimeMin",
	"arrivalTimeMax",
	"lineResolution",
]