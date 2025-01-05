import { JDF2GTFS } from ".";

const jdf2gtfs = new JDF2GTFS({
	fileProvider: {
		type: "zipfile",
		path: "/Users/0charliecat/Downloads/MHDNR_2024-12-15_JDF-OPRAVA.zip"
	},
	id_prefix: "",
	platforms: [],
})

await jdf2gtfs.loadFiles()

await jdf2gtfs.makeRoutes()

