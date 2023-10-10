const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const { Calendar } = require("./classes")
const getstopid = require("./getstopid")
const pevnykod = require("./pevnykod")

const nil = null

const JDFHeaders = [ "line", "trip", "pk1", "pk2", "pk3", "pk4", "pk5", "pk6", "pk7", "pk8", "pk9", "pk10", "trip_group", "ext" ]  // TODO: look into the docs
const LinkyJDFHeaders = [ "line", "name", "agency", "routing_type", "vehicle_type", "disruption", "group", "use_of_platforms", "one_way_tt", "01", "license_number", "valid_license_from", "valid_license_until", "valid_tt_from", "valid_tt_until",  ] 

const run = async (config) => {
    const filePath = config.path+"/spoje.txt"
    const spojeFileBuffer = fs.readFileSync(filePath);
    const spojeUtf8String = iconv.decode(spojeFileBuffer, 'windows-1250');
    
    const Spoje = await csv().fromString(JDFHeaders.join(",")+"\r\n"+spojeUtf8String)

    const LinkyFilePath = config.path+"/linky.txt"
    const LinkyFileBuffer = fs.readFileSync(LinkyFilePath);
    const LinkyUtf8String = iconv.decode(LinkyFileBuffer, 'windows-1250');
    
    const Linky = await csv().fromString(LinkyJDFHeaders.join(",")+"\r\n"+LinkyUtf8String)

    let Entities = []

    for (let ti = 0; ti < Spoje.length; ti++) {
        const te = Spoje[ti];

        let spojpk = await pevnykod(config.path,[te.pk1, te.pk2, te.pk3, te.pk4, te.pk5, te.pk6, te.pk7, te.pk8, te.pk9, te.pk10])
        let monday = spojpk.includes('mondays') || spojpk.includes('workdays')
        let tuesday = spojpk.includes('tuesdays') || spojpk.includes('workdays')
        let wednesday = spojpk.includes('wednesdays') || spojpk.includes('workdays')
        let thursday = spojpk.includes('thursdays') || spojpk.includes('workdays')
        let friday = spojpk.includes('fridays') || spojpk.includes('workdays')
        let saturday = spojpk.includes('saturdays') 
        let sunday = spojpk.includes('sundays') || spojpk.includes('holidays')

        let linka = Linky.find(e=>e.line === te.line)

        let cal = new Calendar({
            service_id: `${config.id_prefix}C_${te.line}_${te.trip}`,
            monday: BoolNumber(monday),
            tuesday: BoolNumber(tuesday),
            wednesday: BoolNumber(wednesday),
            thursday: BoolNumber(thursday),
            friday: BoolNumber(friday),
            saturday: BoolNumber(saturday),
            sunday: BoolNumber(sunday),
            start_date: convertDate(linka.valid_tt_from),
            end_date: convertDate(linka.valid_tt_until)
        })

        Entities.push(cal)
    }
    return Entities
}

module.exports = run

/**
 * Converts JDF date to GTFS date
 * @param {String} inputDate
 * @returns {String}
 */
function convertDate(inputDate) {
    // Extract day, month, and year components from the input string
    const day = inputDate.substring(0, 2);
    const month = inputDate.substring(2, 4);
    const year = inputDate.substring(4, 8);
  
    // Create a new date string in the YYYYMMDD format
    const outputDate = `${year}${month}${day}`;
  
    return outputDate;
}

function BoolNumber(bool) {
    return (bool) ? 1 : 0
}