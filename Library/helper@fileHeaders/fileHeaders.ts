export default {
	VerzeJDF: [ // Refering to @isithere/jdf_types/VerzeJDF.ts
		"version",				// Číslo verze JDF • povinný text 
		"publisherDUID",
		"publisherRegion",
		"feedID",
		"feedProducedDate",
		"name"
	],
	Spoje: [ 
		"lineID", 
		"tripSequence", 
		"PK_1", 
		"PK_2", 
		"PK_3", 
		"PK_4", 
		"PK_5", 
		"PK_6", 
		"PK_7", 
		"PK_8", 
		"PK_9", 
		"PK_10", 
		"tripGroupID", 
		"lineExt" 
	],
	Zasspoje: [ "lineID", "tripSequence", "stopSequence", "stopID", "platformNumber", "platformID", "PK_1", "PK_2", "PK_3", "kilometersTraveled", "inTime", "outTime", "inTimeMin", "outTimeMax","lineExt"]	// TODO: look into the docs
}