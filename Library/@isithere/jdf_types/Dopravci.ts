/// # Dopravci
/// The Dopravci file is a codebook of carriers of routes in the feed. The relation (Between Dopravci-Linky) is created through the ID
/// Assigning multiple carriers to a single line is supported using Altdop. If it is necessary to assign different carriers with the same `IČO` number to different lines, 
/// it is necessary to distinguish the following records in the `Rozlišení dopravce`
///
///	| field name			| description of the field					| data format		|
///	|-----------------------|-------------------------------------------|-------------------|
///	| IČ					| - required text							| DbString (10)		|
/// | DIČ					| - optional text							| DbString (10)		|
/// | Obchodní jméno 		| - required text							| DbString (254)	|
/// | Druh firmy			| - reqired text, see `DopravcaFirmaType`	| DbString (1)		|
/// | Jméno fyz.osoby		| - conditionaly required text, see docs	| DbString (254)	|
/// | Sídlo (adresa)		| - required text							| DbString (254)	|
/// | Telefon sidla			| - required text							| DbString (48)		|
/// | Telefon dispečink 	| - optional text							| DbString (48)		|
/// | Telefon informace 	| - optional text							| DbString (48)		|
/// | Fax					| - optional text							| DbString (48)		|
/// | E-mail				| - optional text							| DbString (48)		|
/// | www					| - optional text							| DbString (48)		|
/// | Rozlišení dopravce	| - required number							| DbLong			|
///
/// ## Translated field names
/// - `IČ` => `agencyID`
/// - `DIČ` => `vatID`
/// - `Obchodní jméno` => `name`
/// - `Druh firmy` => `companyType`
/// - `Jméno fyz.osoby` => `personName`
/// - `Sídlo (adresa)` => `address`
/// - `Telefon sidla` => `phoneOffice`
/// - `Telefon dispečink` => `phoneDispatch`
/// - `Telefon informace` => `phoneInfo`
/// - `Fax` => `fax`
/// - `E-mail` => `email`
/// - `www` => `website`
/// - `Rozlišení dopravce` => `agencyResolution`

/// Type of the agency
/// - `1` => `company`
/// - `2` => `person`
export enum DopravciCompanyType {
	PravnickaOsoba = "1",
	FyzickaOsoba = "2",
}

export interface Dopravci {
	agencyID:			string
	vatID:				string
	name:				string
	companyType:		DopravciCompanyType
	personName:			string
	address:			string
	phoneOffice:		string
	phoneDispatch:		string
	phoneInfo:			string
	fax:				string
	email:				string
	website:			string
	agencyResolution:	string
}

export const headers = [
	"agencyID",
	"vatID",
	"name",
	"companyType",
	"personName",
	"address",
	"phoneOffice",
	"phoneDispatch",
	"phoneInfo",
	"fax",
	"email",
	"website",
	"agencyResolution",
]