/*
	# VerzeJDF
	The file carries information about the version of JDF format used and data identifying the feed content.
	In JDF version 1.11, the required text field `Číslo verze JDF` needs to be filled with the value "1.11".
	
	| název pole			| charakter a popis pole			| formát dat		|
	|-----------------------|-----------------------------------|-------------------|
	| Číslo verze JDF		| - required text 					| value "1.11“		|
	| Číslo DÚ				| - optional 3 digit number			| DbLong			|
	| Okres/Kraj			| - optional text					| DbString (2)		|
	| Identifikace dávky	| - optional text					| DbString (20)		|
	| Datum výroby dávky	| - required date (DDMMRRRR)		| DbDate			|
	| Jméno					| - optional text					| DbString (60)		|

	## Translated field names
	- `Číslo verze JDF` => `version`
	- `Číslo DÚ` => `publisherDUId`
	- `Okres/Kraj` => `publisherRegion`
	- `Identifikace dávky` => `feedID`
	- `Datum výroby dávky` => `feedProducedDate`
	- `Jméno` => `feedName`
*/

import { DDMMYYYY } from "./universal"

export interface VerzeJDF {
	version:		 	"1.11" | string
	publisherDUId?:		number
	publisherRegion?:	string
	feedID?:			string
	feedProducedDate:	DDMMYYYY
	feedName?:			string
}

export const headers = [
	"version",
	"publisherDUId",
	"publisherRegion",
	"feedID",
	"feedProducedDate",
	"feedName"
]