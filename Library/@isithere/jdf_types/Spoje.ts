/// # Spoje
/// The file Spoje contains infomation about the trips in the feed. It exactly cointains one record for every trip.
/// The record defines Trip Number, Service Schedule and it's Caveats.
/// To a record thats fully or partially ran based on a prior order, It is required to create a CasKod
///
///	| field name			| description of the field					| data format		|
///	|-----------------------|-------------------------------------------|-------------------|
/// | Čislo linky			| - required number, dependant on Linka		| DbLong			|
///	| Číslo spoje			| - required number							| DbLong			|
/// | Pev. kód 1			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 2			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 3			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 4			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 5			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 6			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 7			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 8			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 9			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Pev. kód 10			| - required number, dependant on PevnyKod	| DbString(5)		|
/// | Kód skupiny spojů		| - required number, dependant on SpojSkup	| DbLong			|
/// | Rozlišení linky		| - required number, dependant on SpojSkup	| DbLong			|
///
/// ## Translated field names
/// - `Čislo linky` => `routeId`
/// - `Číslo spoje` => `tripNumber`
/// - `Pev. kód 1` => `pk_1`
/// - `Pev. kód 2` => `pk_2`
/// - `Pev. kód 3` => `pk_3`
/// - `Pev. kód 4` => `pk_4`
/// - `Pev. kód 5` => `pk_5`
/// - `Pev. kód 6` => `pk_6`
/// - `Pev. kód 7` => `pk_7`
/// - `Pev. kód 8` => `pk_8`
/// - `Pev. kód 9` => `pk_9`
/// - `Pev. kód 10` => `pk_10`
/// - `Kód skupiny spojů` => `tripGroupId`
/// - `Rozlišení linky` => `lineResolution`


/// Reference to a `Spoj`
/// > ⚠️ Warning: Use with `Linky.LineNumber` 
type TripNumber = string

export interface Spoje {
	lineNumber: string
	tripNumber: TripNumber
	pk_1: string
	pk_2: string
	pk_3: string
	pk_4: string
	pk_5: string
	pk_6: string
	pk_7: string
	pk_8: string
	pk_9: string
	pk_10: string
	tripGroupId: number
	lineResolution: number
}

export const headers = [
	"lineNumber",
	"tripNumber",
	"pk_1",
	"pk_2",
	"pk_3",
	"pk_4",
	"pk_5",
	"pk_6",
	"pk_7",
	"pk_8",
	"pk_9",
	"pk_10",
	"tripGroupId",
	"lineResolution"
]