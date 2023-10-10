const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const { FeedInfo } = require("./classes")

const nil = null

const JDFHeaders = [ "number", "name", "agency", "routing_type", "vehicle_type", "disruption", "group", "use_of_platforms", "one_way_tt", "01", "license_number", "valid_license_from", "valid_license_until", "valid_tt_from", "valid_tt_until",  ] 

const run = async (config) => {
    const filePath = config.path+"/linky.txt"
    const linkyFileBuffer = fs.readFileSync(filePath);
    const linkyUtf8String = iconv.decode(linkyFileBuffer, 'windows-1250');
    const Linky = await csv().fromString(JDFHeaders.join(",")+"\r\n"+linkyUtf8String)

    let now = new Date()

    let earliestDate = Linky.sort((a,b)=>a.valid_tt_from-b.valid_tt_from)[0].valid_tt_from
    let latestDate   = Linky.sort((a,b)=>b.valid_tt_until-a.valid_tt_until)[0].valid_tt_until
    
    
    let Entities = []
    let info = new FeedInfo({
        feed_publisher_name: config.feed_publisher_name,
        feed_publisher_url: config.feed_publisher_url,
        feed_lang: config.lang,
        default_lang: config.lang,
        feed_start_date: (config.start_date) ? config.start_date : convertDate(earliestDate),
        feed_end_date: (config.end_date) ? config.end_date : convertDate(latestDate),
        feed_version: String(Number(now)),
        feed_contact_email: config.feed_contact_email,
        feed_contact_url: config.feed_contact_url,
    })
    Entities.push(info)
    return Entities
}

module.exports = run

/**
 * Converts JDF date to GTFS date
 * @param {String} inputDate
 * @returns {String}
 */
function convertDate(inputDate) {
    console.log(inputDate)
    // Extract day, month, and year components from the input string
    const day = inputDate.substring(0, 2);
    const month = inputDate.substring(2, 4);
    const year = inputDate.substring(4, 8);
  
    // Create a new date string in the YYYYMMDD format
    const outputDate = `${year}${month}${day}`;
  
    return outputDate;
}