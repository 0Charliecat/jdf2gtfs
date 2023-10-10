const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const { Trip } = require("./classes")
const getstopid = require("./getstopid")
const pevnykod = require("./pevnykod")

const nil = null

const JDFHeaders = [ "line", "trip", "pk1", "pk2", "pk3", "pk4", "pk5", "pk6", "pk7", "pk8", "pk9", "pk10", "trip_group", "ext" ] 
const ZasspojeJDFHeaders = [ "line", "trip", "sequence", "stop", "01", "plt", "02","03","04","05","06","time","07","08","09"] // TODO: look into the docs

const run = async (config) => {
    const filePath = config.path+"/spoje.txt"
    const spojeFileBuffer = fs.readFileSync(filePath);
    const spojeUtf8String = iconv.decode(spojeFileBuffer, 'windows-1250');
    
    const Spoje = await csv().fromString(JDFHeaders.join(",")+"\r\n"+spojeUtf8String)

    const zasspojeFilePath = config.path+"/zasspoje.txt"
    const zasspojeFileBuffer = fs.readFileSync(zasspojeFilePath);
    const zasspojeUtf8String = iconv.decode(zasspojeFileBuffer, 'windows-1250');
    
    const Zasspoje = await csv().fromString(ZasspojeJDFHeaders.join(",")+"\r\n"+zasspojeUtf8String)
    let Entities = []

    for (let ti = 0; ti < Spoje.length; ti++) {
        const te = Spoje[ti];
        let lastStopOfTheTrip = Zasspoje.filter(e=>e.line===te.line&&e.trip===te.trip).filter(e=>e.time!==">"&&e.time!=="|").sort((a,b) => a.sequence - b.sequence).at(-1)

        let spojpk = await pevnykod(config.path,[te.pk1, te.pk2, te.pk3, te.pk4, te.pk5, te.pk6, te.pk7, te.pk8, te.pk9, te.pk10])
        let wheelchair_accessible = spojpk.includes("wheelchair_accessible")
        let bikes_allowed = spojpk.includes("trip_offers_bike_transfers")
        

        let trip = new Trip({
            route_id: `${config.id_prefix}${te.line}`,
            service_id: `${config.id_prefix}C_${te.line}_${te.trip}`,
            trip_id: `${config.id_prefix}${te.line}_${te.trip}`,
            trip_headsign: config.stops.find(e=>e.stop_id===getstopid(config,lastStopOfTheTrip.stop)).stop_name,
            trip_short_name: `${config.stops.find(e=>e.stop_id===getstopid(config,lastStopOfTheTrip.stop)).stop_name} (Spoj ${te.trip})`,
            shape_id: `${config.id_prefix}S_${te.line}_${te.trip}`,
            wheelchair_accessible: (wheelchair_accessible) ? 1 : 0,
            bikes_allowed: (bikes_allowed) ? 1 : 0
        })
        Entities.push(trip)
    }
    return Entities
}

module.exports = run
