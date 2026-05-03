/*
	# Oznacniky
	File `Oznacniky` serves as a codebook of stop markers (označníky) for the feed.
	A stop marker is bound to exactly one stop (binding to `Zastavky`).
	Markers of one stop are distinguished by the field `Kód označníku`, whose value
	must correspond to the national stop registry CIS JŘ.

	| název pole			| charakter a popis pole							| formát dat		|
	|-----------------------|-----------------------------------------------|-------------------|
	| Číslo zastávky		| - povinné číslo								| DbLong			|
	| Kód označníku			| - povinné číslo								| DbLong			|
	| Název					| - nepovinný text								| DbString (48)		|
	| Směr/popis			| - nepovinný text								| DbString (48)		|
	| Stanoviště			| - nepovinný text, označení pro veřejnost		| DbString (12)		|
	| Rezerva				| - nepovinný text								| DbString (254)	|
	| Rezerva				| - nepovinný text								| DbString (254)	|

	## Translated field names
	- `Číslo zastávky` => `stopID`
	- `Kód označníku` => `markerCode`
	- `Název` => `name`
	- `Směr/popis` => `direction`
	- `Stanoviště` => `stand`
	- `Rezerva` (1) => `reserve1`
	- `Rezerva` (2) => `reserve2`
*/

export interface Oznacniky {
	stopId: string
	markerCode: string
	name?: string
	direction?: string
	stand?: string
	reserve1?: string
	reserve2?: string
}

export const headers = [
	"stopId",
	"markerCode",
	"name",
	"direction",
	"stand",
	"reserve1",
	"reserve2"
]
