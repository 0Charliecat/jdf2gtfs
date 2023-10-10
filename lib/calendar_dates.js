const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const { CalendarDate } = require("./classes")
const pevnykod = require("./pevnykod")
const { getAllHolidays } = require('slovak-holidays')

const nil = null

const CaskodyJDFHeaders = [ "line", "trip", "id", "mark", "type", "from", "until", "note", "line_ext" ] 
const SpojeJDFHeaders = [ "line", "trip", "pk1", "pk2", "pk3", "pk4", "pk5", "pk6", "pk7", "pk8", "pk9", "pk10", "trip_group", "ext" ]
const CaskodyJDFTypes = { "1": "1", "2": "1", "3": "1", "4": "2" }

const run = async (config) => {
    const spojeFilePath = config.path+"/spoje.txt"
    const spojeFileBuffer = fs.readFileSync(spojeFilePath);
    const spojeUtf8String = iconv.decode(spojeFileBuffer, 'windows-1250');
    const Spoje = await csv().fromString(SpojeJDFHeaders.join(",")+"\r\n"+spojeUtf8String)

    const CaskodyFilePath = config.path+"/caskody.txt"
    const CaskodyFileBuffer = fs.readFileSync(CaskodyFilePath);
    const CaskodyUtf8String = iconv.decode(CaskodyFileBuffer, 'windows-1250');
    const Caskody = await csv().fromString(CaskodyJDFHeaders.join(",")+"\r\n"+CaskodyUtf8String)

    let holidaysByConfigYears = config.years.map(getAllHolidays).flat()

    let Entities = []

    for (let ti = 0; ti < Spoje.length; ti++) {
        const te = Spoje[ti];

        let spojpk = await pevnykod(config.path,[te.pk1, te.pk2, te.pk3, te.pk4, te.pk5, te.pk6, te.pk7, te.pk8, te.pk9, te.pk10])
        let spojholidays = spojpk.includes('holidays')
        if (!spojholidays) continue;

        for (holiday of holidaysByConfigYears) {
            let cal = new CalendarDate({
                service_id: `${config.id_prefix}C_${te.line}_${te.trip}`,
                date: `${String(holiday.year).padStart(2, '0')}${String(holiday.month).padStart(2, '0')}${String(holiday.day).padStart(2, '0')}`,
                exception_type: "1"
            })
    
            Entities.push(cal)
        }
    }
    for (let ci = 0; ci < Caskody.length; ci++) {
        const ce = Caskody[ci];

        if (ce.from.length===0) continue;

        if (ce.until.length===0) {
            let cal = new CalendarDate({
                service_id: `${config.id_prefix}C_${ce.line}_${ce.trip}`,
                date: convertDate(ce.from),
                exception_type: CaskodyJDFTypes[ce.type]
            })
    
            Entities.push(cal)
        } else {
            let dates = getDatesBetween(formatDateFromDDMMYYYY(ce.from), formatDateFromDDMMYYYY(ce.until))
            for (let cdi = 0; cdi < dates.length; cdi++) {
                const cde = dates[cdi];
                //console.log(cde)
                let cal = new CalendarDate({
                    service_id: `${config.id_prefix}C_${ce.line}_${ce.trip}`,
                    date: formatDateToYYYYMMDD(cde),
                    exception_type: CaskodyJDFTypes[ce.type]
                })
        
                Entities.push(cal)
            }
        }

        continue;
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

/**
 * getDatesBetween(startDate, endDate) • gets dates between two JS Dates
 * @param {Date} startDate
 * @param {Date} endDate
 * @returns {Date[]}
 */
function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);
  
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    return dates;
  }

  /**
   * Dformats a js date to gtfs date
   * @param {Date} date
   * @returns {String}
   */
  function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const day = date.getDate().toString().padStart(2, '0');
    
    return year + month + day;
  }
  /**
   * formats jdf date to js date
   * @param {String} ddmmyyyy
   * @returns {Date}
   */
  function formatDateFromDDMMYYYY(ddmmyyyy) {
    const day = parseInt(ddmmyyyy.slice(0, 2), 10);
    const month = parseInt(ddmmyyyy.slice(2, 4), 10) - 1; // Months are zero-indexed
    const year = parseInt(ddmmyyyy.slice(4, 8), 10);
  
    return new Date(year, month, day);
  }