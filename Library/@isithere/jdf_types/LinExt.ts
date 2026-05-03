/// # LinExt
/// LinExt allows for route association with MHD (Urban PT Network) or IDS (Integrated Transport System). 
///	For specific version of the route only one association is allowed.
/// `Preference označení` tells about the preference of IDS/MHD association in timetable visualisations.
///
/// | field name			| description of the field					| data format		|
/// |-----------------------|-------------------------------------------|-------------------|
/// | Číslo linky			| - required text, relation to Linky		| DbString (6)		|
/// | Pořadí				| - required number							| DbLong			|
/// | Kód dopravy			| - required text, see `KodDopravy`			| DbString (5)		|
/// | Označení linky 		| - required text, local route short name	| DbString (10)		|
/// | Preference označení 	| - required boolean						| Bit				|
/// | Rezerva				| - optional text							| DbString (245)	|
/// | Rozlišení linky 		| - required number							| DbLong			|
///
/// # Remarks
/// - `Kód dopravy` is a code for the type of transport as used by Czech version of CIS JŘ.
/// - Not used in Slovakia
/// - Think of `Preference označení` as a flag for the specified route short name to be displayed in timetables.
/// - If MHD is integrated into IDS, use the MHD code
/// - `Pořadí` has a note of *"pořadí v rámci linky"*

import { BiteBoolean } from "./universal"


/// Type of transport
/// - see for **IDS** https://www.cisjr.cz/doc/ids.htm
/// - see for **MHD** https://www.cisjr.cz/doc/mhd.htm
type KodDopravy = KodDopravyIDS | KodDopravyMHD

/// Transport Type for IDS
/// (https://www.cisjr.cz/doc/ids.htm)
/// | Kód |	Název																	| Zkratka	|
/// |-----|-------------------------------------------------------------------------|-----------|
/// | 421 |	Doprava Ústeckého kraje 												| DÚK		|
/// | 321 |	Integrovaná doprava Plzeňského kraje 									| IDPK		|
/// | 722 |	Integrovaná doprava Zlínského kraje 									| IDZK		|
/// | 311 |	Integrovaný dopravní systém Jihočeského kraje 							| IDS JK	|
/// | 621 |	Integrovaný dopravní systém Jihomoravského kraje 						| IDS JMK	|
/// | 411 |	Integrovaný dopravní systém Karlovarského kraje 						| IDOK		|
/// | 512 |	Integrovaný dopravní systém Libereckého kraje							| IDOL		|
/// | 811 |	Integrovaný dopravní systém Moravskoslezského kraje 					| ODIS		|
/// | 313 |	Integrovaný dopravní systém Táborska 									| IDS TA	|
/// | 711 |	Integrovaný dopravní systém Olomouckého kraje 							| IDSOK		|
/// | 522 |	Integrovaná regionální doprava Královéhradeckého a Pardubického kraje 	| IREDO		|
/// | 111 |	Pražská integrovaná doprava 											| PID		|
/// | 631 |	Veřejná doprava Vysočiny 												| VDV		|
/// | 521 |	Východočeský dopravní integrovaný systém 								| VYDIS		|
type KodDopravyIDS = "421" | "321" | "722" | "311" | "621" | "411" | "512" | "811" | "313" | "711" | "522" | "111" | "631" | "521"

/// Transport Type for MHD
/// (https://www.cisjr.cz/doc/mhd.htm)
/// | Kód 	| Název					|
/// |-------|-----------------------|
/// | 30001	| Praha 				|
/// | 30004	| České Budějovice 		|
/// | 30005	| Olomouc 				|
/// | 30007	| Plzeň 				|
/// | 30017	| Český Těšín 			|
/// | 30018	| Třinec 				|
/// | 30023	| Havířov 				|
/// | 30028	| Žďár nad Sázavou 		|
/// | 30036	| Karlovy Vary 			|
/// | 30041	| Jihlava 				|
/// | 30044	| Ústí nad Labem 		|
/// | 30065	| Litomyšl 				|
/// | 30069	| Jáchymov 				|
/// | 30071	| Velké Meziříčí		|
/// | 30091	| Ostrov 				|
/// | 30209	| Duchcov 				|
/// | 30211	| Kadaň 				|
/// | 30212	| Klášterec nad Ohří 	|
/// | 30220	| Nové Město na Moravě	|
/// | 30621	| IDS-JMK 				|
type KodDopravyMHD = "30001" | "30004" | "30005" | "30007" | "30017" | "30018" | "30023" | "30028" | "30036" | "30041" | "30044" | "30065" | "30069" | "30071" | "30091" | "30209" | "30211" | "30212" | "30220" | "30621"

export interface LinExt {
	lineNumber:				string
	order:					number
	transportCode:			KodDopravy
	routeShortName:			string
	preference:				BiteBoolean
	reserved1:				string
}

export const headers = [
	"lineNumber",
	"order",
	"transportCode",
	"routeShortName",
	"preference",
	"reserved1",
]