const iconv = require("iconv-lite")
const csv=require("csvtojson");
const fs = require("fs")
const { RouteType, Route } = require("./classes")

const nil = null

const JDFHeaders = [ "number", "name", "agency", "routing_type", "vehicle_type", "disruption", "group", "use_of_platforms", "one_way_tt", "01", "license_number", "valid_license_from", "valid_license_until", "valid_tt_from", "valid_tt_until",  ] 
const JDFVehicleType = { A: RouteType.BUS, E: RouteType.TRAM, L: RouteType.FUNICULAR, M: RouteType.METRO, P: RouteType.FERRY, T: RouteType.TROLLEYBUS }

const run = async (config) => {
    const filePath = config.path+"/linky.txt"
    const linkyFileBuffer = fs.readFileSync(filePath);
    const linkyUtf8String = iconv.decode(linkyFileBuffer, 'windows-1250');
    
    const Linky = await csv().fromString(JDFHeaders.join(",")+"\r\n"+linkyUtf8String)
    let Entities = []

    for (let li = 0; li < Linky.length; li++) {
        const le = Linky[li];
        let route = new Route({
            route_id: `${config.id_prefix}${le.number}`,
            agency_id: `${config.id_prefix}${le.agency}`,
            route_short_name: (config.line_number_changes.hasOwnProperty(le.number)) ? config.line_number_changes[le.number] : le.number,
            route_long_name: le.name,
            route_type: (config.line_route_type_override.hasOwnProperty(le.number)) ? config.line_route_type_override[le.number] : JDFVehicleType[le.vehicle_type],
            route_color: (config.line_colors.hasOwnProperty(le.number)) ? config.line_colors[le.number].background : "ffffff",
            route_text_color: (config.line_colors.hasOwnProperty(le.number)) ? config.line_colors[le.number].foreground : "000000",
            network_id: (config.line_network.hasOwnProperty(le.number)) ? config.line_network[le.number] : "",
        })
        Entities.push(route)
    }
    return Entities
}

module.exports = run
