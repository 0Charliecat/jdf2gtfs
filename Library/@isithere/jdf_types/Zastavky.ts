/*
	# Zastavky
	File `Zastavky` serves as a codebook of stops for the feed. The binding is done through the stop number (from `Zasspoje` and `Zaslinky`). 
	The full stop name is created for print outputs by concatenating all three parts separated by commas, i.e. <Locality name>,<Locality part>,<Near place>
	and supplemented by stop attributes from the file `Pevnykod` (if they relate to the stop – i.e. x, MHD, WC, etc.). 
	If an international line has a border crossing point for passport and customs purposes only,
	the name of the border crossing point is stated in the attributes in the `Zaslinky` file with a fixed code "$" (CLO). 
	This fixed code is not stated if the border crossing point is a stop for boarding and alighting passengers. 
	The field `Stát` is always required. The field `Blízká obec` is required only for stops in the Czech Republic and Slovakia.


	| název pole			| charakter a popis pole			| formát dat		|
	|-----------------------|-----------------------------------|-------------------|
	| Číslo zastávky		| - povinné číslo					| DbLong			|
	| Název obce			| - povinný text					| DbString (48)		|
	| Část obce				| - nepovinný text					| DbString (48)		|
	| Bližší místo			| - nepovinný text					| DbString (48)		|
	| Blízká obec			| - nepovinný text					| DbString (48)		|
	| Stát					| - povinný text					| DbString (3)		|
	| Pevný kód 1			| - nepovinný text					| DbString (5)		|
	| Pevný kód 2			| - nepovinný text					| DbString (5)		|
	| Pevný kód 3			| - nepovinný text					| DbString (5)		|
	| Pevný kód 4			| - nepovinný text					| DbString (5)		|
	| Pevný kód 5			| - nepovinný text					| DbString (5)		|

	## Translated field names
	- `Číslo zastávky` => `stopID`
	- `Název obce` => `localityName`
	- `Část obce` => `localityPart`
	- `Bližší místo` => `nearPlace`
	- `Blízká obec` => `nearLocality`
	- `Stát` => `country`
	- `Pevný kód 1` => `pk_1`
	- `Pevný kód 2` => `pk_2`
	- `Pevný kód 3` => `pk_3`
	- `Pevný kód 4` => `pk_4`
	- `Pevný kód 5` => `pk_5`

	## Remarks
	Feeds for MHD (city public transport) ussually ignore `localityName` and `localityPart`, and use `nearPlace` instead.
*/

export interface Zastavky {
	stopID: string
	localityName: string
	localityPart?: string
	nearPlace?: string
	nearLocality?: string
	country: string
	pk_1?: string
	pk_2?: string
	pk_3?: string
	pk_4?: string
	pk_5?: string
}

export const headers = [
	"stopID",
	"localityName",
	"localityPart",
	"nearPlace",
	"nearLocality",
	"country",
	"pk_1",
	"pk_2",
	"pk_3",
	"pk_4",
	"pk_5"
]
