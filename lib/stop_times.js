const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const { StopTimes, TimePoint, PickupType } = require("./classes")
const getstopid = require("./getstopid")
const pevnykod = require("./pevnykod")

const nil = null

const JDFHeaders = [ "line", "trip", "tarif", "stop", "plt", "plt_mark", "pk1","pk2","pk3","km","arrival_time","departure_time","arrival_time_minimum","departure_time_maximum","line_ext"] // TODO: look into the docs
const ZaslinkyJDFHeaders = [ "line", "tarif", 'tarif_zone', "stop", "average_min", "pk1", "pk2", "pk3", "line_ext"]

const run = async (config) => {
    const filePath = config.path+"/zasspoje.txt"
    const zasspojeFileBuffer = fs.readFileSync(filePath);
    const zasspojeUtf8String = iconv.decode(zasspojeFileBuffer, 'windows-1250');
    
    const Zasspoje = await csv().fromString(JDFHeaders.join(",")+"\r\n"+zasspojeUtf8String)

    const zaslinkyFilePath = config.path+"/zaslinky.txt"
    const zaslinkyFileBuffer = fs.readFileSync(zaslinkyFilePath);
    const zaslinkyUtf8String = iconv.decode(zaslinkyFileBuffer, 'windows-1250');
    
    const Zaslinky = await csv().fromString(ZaslinkyJDFHeaders.join(",")+"\r\n"+zaslinkyUtf8String)

    let Entities = []
    let stop_sequences = {}

    for (let ti = 0; ti < Zasspoje.length; ti++) {
        const te = Zasspoje[ti];
        if (te.departure_time === "|" || te.departure_time === "<") continue;

        let zaslinky = Zaslinky.filter(e=>e.line===te.line&&e.stop===te.stop)

        let pk = await pevnykod(config.path, [ te.pk1, te.pk2, te.pk3, zaslinky.pk1, zaslinky.pk2, zaslinky.pk3 ])
        let onReq = pk.includes('on_request_stop')
        /*let dropOffOnly = [ te.pk1, te.pk2, te.pk3, zaslinky.pk1, zaslinky.pk2, zaslinky.pk3 ].includes('(') TODO: PickUp and DropOff changes
        let pickupOnly =  [ te.pk1, te.pk2, te.pk3, zaslinky.pk1, zaslinky.pk2, zaslinky.pk3 ].includes(')')*/

        let stop_sequence = 0
        if (stop_sequences.hasOwnProperty(`${config.id_prefix}${te.line}_${te.trip}`)) {
            stop_sequence = stop_sequences[`${config.id_prefix}${te.line}_${te.trip}`]+1
            stop_sequences[`${config.id_prefix}${te.line}_${te.trip}`]++
        } else {
            stop_sequence = stop_sequences[`${config.id_prefix}${te.line}_${te.trip}`] = 0
        }
        
        let time = new StopTimes({
            trip_id: `${config.id_prefix}${te.line}_${te.trip}`,
            arrival_time: (te.arrival_time.length===0) ? String(te.departure_time).padStart(4, '0').replace(/(..)(..)/, '$1:$2:00') : String(te.arrival_time).padStart(4, '0').replace(/(..)(..)/, '$1:$2:00'),
            departure_time: (te.departure_time.length===0) ? String(te.arrival_time).padStart(4, '0').replace(/(..)(..)/, '$1:$2:00') : String(te.departure_time).padStart(4, '0').replace(/(..)(..)/, '$1:$2:00'),
            stop_id: `${getstopid(config,te.stop)}_${te.plt_mark}`,
            stop_sequence: stop_sequence,
            stop_headsign: null,
            pickup_type: (onReq) ? PickupType.DRIVER_ARAGEMENT : PickupType.REGULAR,
            drop_off_type: (onReq) ? PickupType.DRIVER_ARAGEMENT : PickupType.REGULAR,
            //continuous_pickup: (pickupOnly) ? PickupType.REGULAR : ,
            //continuous_drop_off: PickupType,
            timepoint: TimePoint.EXACT
        })

        Entities.push(time)
    }
    return Entities
}

module.exports = run
