const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const { Stop } = require("./classes")

const nil = null

const JDFHeaders = [ "id", "city", "borough", "name", "nearby_city", "country", "pk1", "pk2", "pk3", "pk4", "pk5", "pk6" ]

const run = async (config) => {
    const filePath = config.path+"/zastavky.txt"
    const zastavkyFileBuffer = fs.readFileSync(filePath);
    const zastavkyUtf8String = iconv.decode(zastavkyFileBuffer, 'windows-1250');
    
    const Zastavky = await csv().fromString(JDFHeaders.join(",")+"\r\n"+zastavkyUtf8String)
    let Entities = []

    for (let zi = 0; zi < Zastavky.length; zi++) {
        const ze = Zastavky[zi];
        let stop = new Stop({
            stop_id: (config.stop_ids.hasOwnProperty(ze.id)) ? config.stop_ids[ze.id] : `${config.id_prefix}${ze.id}`,
            stop_name: StationNameConstructor(ze),
            stop_code: (config.stop_codes.hasOwnProperty(ze.id)) ? config.stop_codes[ze.id] : nil,
            stop_lat: config.locations[ze.id][1],
            stop_lon: config.locations[ze.id][0],
            location_type: 1,
        })
        Entities.push(stop)
    }

    for (let pi = 0; pi < config.platforms.length; pi++) {
        const pe = config.platforms[pi];
        let stop = new Stop({
            stop_id: (config.stop_ids.hasOwnProperty(pe.parent)) ? config.stop_ids[pe.parent]+"_"+pe.code : `${config.id_prefix}${pe.parent}_${pe.code}`,
            stop_name: Entities.find(e=>e.stop_id===((config.stop_ids.hasOwnProperty(pe.parent)) ? config.stop_ids[pe.parent] : `${config.id_prefix}${pe.parent}`)).stop_name,
            stop_lat: pe.location[1],
            stop_lon: pe.location[0],
            location_type: 0,
            parent_station: (config.stop_ids.hasOwnProperty(pe.parent)) ? config.stop_ids[pe.parent] : `${config.id_prefix}${pe.parent}`,
            stop_timezone: config.timezone
        })
        Entities.push(stop)
    }

    return Entities
}

module.exports = run

/**
 * Constructing force for Stop Names
 * @param {{city: String?, borough: String?, name: String}} obj
 * @returns {String} i.e. Bratislava, Vajnory, MiÚ Vajnory
 */
function StationNameConstructor(obj) {
    let result = '';

    if (obj.city.length!==0) {
        result = obj.city;
    }

    if (obj.borough.length!==0) {
        if (result) {
            result += `, ${obj.borough}`;
        } else {
            result = obj.borough;
        }
    }

    if (obj.name) {
        if (result) {
            result += `, ${obj.name}`;
        } else {
            result = obj.name;
        }
    }

    return result;
}