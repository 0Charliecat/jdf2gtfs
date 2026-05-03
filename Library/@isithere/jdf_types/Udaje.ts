/*
	# Udaje
	File `Udaje` contains textual information about a line published alongside the timetable
	(additional data needed for informing passengers). Each row of text is one record;
	within a line records are distinguished by `Číslo údaje` (sequential row number).
	The total length of text information for one line is limited to 4000 characters.
	Other characters are ignored.

	In printed timetables this content appears as a numbered "Poznámky" (Notes) section.

	| název pole			| charakter a popis pole							| formát dat		|
	|-----------------------|-----------------------------------------------|-------------------|
	| Číslo linky			| - povinné šestimístné číslo, vazba do Linky	| DbLong			|
	| Číslo údaje			| - povinné číslo (pořadové číslo řádku)		| DbLong			|
	| Text					| - povinný text								| DbString (254)	|
	| Rozlišení linky		| - povinné číslo, vazba do Linky				| DbLong			|

	## Translated field names
	- `Číslo linky` => `lineNumber`
	- `Číslo údaje` => `rowNumber`
	- `Text` => `text`
	- `Rozlišení linky` => `lineResolution`
*/

export interface Udaje {
	lineNumber: string
	rowNumber: string
	text: string
	lineResolution: string
}

export const headers = [
	"lineNumber",
	"rowNumber",
	"text",
	"lineResolution"
]
