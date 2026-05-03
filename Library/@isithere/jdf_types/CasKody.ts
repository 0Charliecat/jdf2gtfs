/// # CasKody
/// This file is designed to set information on the time range of operation for individual connections on specific days or at specific intervals of days
///
/// | field name			| description of the field					| data format		|
///	|-----------------------|-------------------------------------------|-------------------|
/// | Čislo linky			| - required number, dependant on Linka		| DbLong			|
/// | Číslo spoje			| - required number, dependant on Spoj		| DbLong			|
/// | Číslo časového kódu 	| - required number							| DbLong			|
/// |Označení časového kódu	| - required text							| DbString(2)		|
/// | Typ časového kódu		| - optional, see CasKodTyp					| DbString(1)		|
/// | Datum od				| - optional date							| DDMMYYYY			|
/// | Datum do				| - optional date							| DDMMYYYY			|
/// | Poznámka				| - optional text							| DbString(254)		|
/// | Rozlišení linky 		| - required number, dependant on Linka		| DbLong			|
///
/// ## Translated field names
/// - `Čislo linky` => `lineNumber`
/// - `Číslo spoje` => `tripNumber`
/// - `Číslo časového kódu` => `exceptionId`
/// - `Označení časového kódu` => `exceptionLabel`
/// - `Typ časového kódu` => `exceptionType`
/// - `Datum od` => `dateFrom`
/// - `Datum do` => `dateUntil`
/// - `Poznámka` => `note`
/// - `Rozlišení linky` => `lineResolution`
///
/// ## Remarks
/// - `Datum od` not needed if `Typ časového kódu` is empty
/// - `Datum do` not needed if `Typ časového kódu` is empty or the exception is valid for one day
///

import { DDMMYYYY } from "./universal"

/// Reference to a `CasKod`
/// > ⚠️ Warning: Use with `Linky.LineNumber` and `Spoje.TripNumber` if possible
type ID = string

/// Type of exception
/// - `1` => goes (jede)
/// - `2` => also goes (jede také)
/// - `3` => only goes (jede jen)
/// - `4` => does not go (nejede)
/// - `5` => goes only in odd weeks (jede jen v lichých týdnech)
/// - `6` => goes only in even weeks (jede jen v sudých týdnech)
/// - `7` => goes only in odd weeks from ... to ... (jede jen v lichých týdnech od … do …)
/// - `8` => goes only in even weeks from ... to ... (jede jen v sudých týdnech od … do …)
// export type CasKodTyp = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"
export enum CasKodTyp {
	GOES = "1",
	ALSO_GOES = "2",
	ONLY_GOES = "3",
	DOES_NOT_GO = "4",
	GOES_ONLY_ODD_WEEKS = "5",
	GOES_ONLY_EVEN_WEEKS = "6",
	GOES_ONLY_ODD_WEEKS_FROM_TO = "7",
	GOES_ONLY_EVEN_WEEKS_FROM_TO = "8",
}

export interface CasKody {
	lineNumber: string

	tripNumber: string

	exceptionId: ID

	exceptionLabel: string

	exceptionType: CasKodTyp

	dateFrom?: DDMMYYYY

	dateUntil?: DDMMYYYY

	note?: string

	lineResolution: number
}

export const headers = [
	"lineNumber",
	"tripNumber",
	"exceptionId",
	"exceptionLabel",
	"exceptionType",
	"dateFrom",
	"dateUntil",
	"note",
	"lineResolution",
]
