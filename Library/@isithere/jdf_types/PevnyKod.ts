/// # PevnyKod
/// PevnyKod is a Schedule/Trip/Stop modifier. See documentation for more information.
///
///	| field name			| description of the field					| data format		|
///	|-----------------------|-------------------------------------------|-------------------|
/// | Číslo pevného kódu 	| - required text							| DbString (5)		|
/// | Označení pevného kódu	| - required text							| DbString (1)		|
/// | Rezerva				| - optional text							| DbString (254)	|
///
/// ## Translated field names
/// - `Číslo pevného kódu` => `key`
/// - `Označení pevného kódu` => `value`
/// - `Rezerva` => `reserved1`
///

type PevnyKodValue = PKScheduleModificators | PKTripReservations | PKRouting | PKTripOptions | PKStopOptions

/// Sets the trip schedule days
/// | value	| description				|
/// |-------|---------------------------|
/// | `X`	| workdays					|
/// | `+`	| holidays and sundays		|
/// | `1`	| monday					|
/// | `2`	| tuesday					|
/// | `3`	| wednesday					|
/// | `4`	| thursday					|
/// | `5`	| friday					|
/// | `6`	| saturday					|
/// | `7`	| sunday					|
type PKScheduleModificators = "X" | "+" | "1" | "2" | "3" | "4" | "5" | "6" | "7"

/// Sets the trip reservation type
/// | value	| description					|
/// |-------|-------------------------------|
/// | `R`	| reservation is possible		|
/// | `#`	| reservation is required		|
type PKTripReservations = "R" | "#"

/// Sets the Vehicle Routing-to-Stop type
/// Used with `Zasspoje`
/// | value	| description					|
/// |-------|-------------------------------|
/// | `\|`	| routed through stop			|
/// | `<`	| uses diffrent route			|
type PKRouting = "|" | "<"

/// Sets the trip options
/// | value	| description																										|
/// |-------|-------------------------------------------------------------------------------------------------------------------|
/// | `@`	| Trip is wheelchair accessible																						|
/// | `%`	| Trip has food service onboard																						|
/// | `{`	| Trip is partially wheelchair accessible																			|
/// | `[`	| Trip offers baggage transfers																						|
/// | `O`	| Trip offers bike transfers																						|
/// | `$`	| Passanger is not allowed to board at stops with the same marker if inteded to exit on identically market stops	|
/// | `A`	| Passanger is not allowed to board at stops with the same marker if inteded to exit on identically market stops	|
/// | `B`	| Passanger is not allowed to board at stops with the same marker if inteded to exit on identically market stops	|
/// | `C`	| Passanger is not allowed to board at stops with the same marker if inteded to exit on identically market stops	|
/// | `T`	| Trip has to be coordinated by phone																				|
/// | `!`	| Trip runs conditionally																							|
type PKTripOptions = "@" | "%" | "{" | "[" | "O" | "$" | "A" | "B" | "C" | "T" | "!"

/// Sets the stop options
/// | value	| description														|
/// |-------|-------------------------------------------------------------------|
/// | `W`	| Stop has a toilet in it's perimeter								|
/// | `w`	| Stop has a wheelchair accessible toilet in it's perimeter			|
/// | `x`	| On Request Stop													|
/// | `~`	| Stop alows for MHD transfers										|
/// | `v`	| Stop alows for train transfers									|
/// | `b`	| Stop alows for bus transfers										|
/// | `U`	| Stop alows for metro transfers									|
/// | `S`	| Stop alows for ship transfers										|
/// | `J`	| Stop is near an airport											|
/// | `P`	| Stop is near a parking lot in P+R system							|
/// | `(`	| Stop is drop off only												|
/// | `)`	| Stop is pick up only												|
/// | `$`	| Stop is a border crossing											|
/// | `}`	| Stop is partially wheelchair accesible							|
/// | `t`	| Stop has a dedicated wheelchair accesible terminal 				|
type PKStopOptions = "W" | "w" | "x" | "~" | "v" | "b" | "U" | "S" | "J" | "P" | "(" | ")" | "$" | "}" | "t"

export interface PevnyKod {
	key: string
	value: PevnyKodValue
	reserved1?: string
}

export const headers = [
	"key",
	"value",
	"reserved1"
]