const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const { Agency } = require("./classes")

const nil = null

const JDFHeaders = [ "id", "dic", "name", "02", "03", "address", "phonenumber_main", "phonenumber_trafic", "phonenumber_info", "fax", "mail", "web", "ext" ] // TODO: docs show a diff than the files used in testing

const run = async (config) => {
    const filePath = config.path+"/dopravci.txt"
    const dopravciFileBuffer = fs.readFileSync(filePath);
    const dopravciUtf8String = iconv.decode(dopravciFileBuffer, 'windows-1250');
    
    const Dopravci = await csv().fromString(JDFHeaders.join(",")+"\r\n"+dopravciUtf8String)
    let Entities = []

    for (let di = 0; di < Dopravci.length; di++) {
        const de = Dopravci[di];
        let agency = new Agency({
            agency_id: `${config.id_prefix}${de.id}`,
            agency_name: de.name,
            agency_url: de.web,
            agency_timezone: config.timezone,
            agency_lang: config.lang,
            agency_phone: de.phonenumber_main,
            agency_fare_url: "",
            agency_email: de.mail,
        })
        Entities.push(agency)
    }
    return Entities
}

module.exports = run
