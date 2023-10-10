const PevnyKod = {
    // Days
    'X': "workdays",
    '+': "holidays",
    '1': "mondays",
    '2': 'tuesdays',
    '3': "wednesdays",
    '4': "thursday",
    '5': "fridays",
    '6': "saturdays",
    '7': "sundays",

    // Reservations
    'R': "reservation_available",
    '#': "reservation_required",

    // Routing
    '|': "routed_through",
    '<': "routed_different_stop",

    // Trip options
    '@': "wheelchair_accessible",
    '%': "food_on_board",
    '{': "trip_is_partially_accessible",
    '[': "trip_offers_baggage_transfers",
    'O': "trip_offers_bike_transfers",
    '$': "0", // this can't be even set up in gtfs
    'A': "0", // this can't be even set up in gtfs
    'B': "0", // this can't be even set up in gtfs
    'C': "0", // this can't be even set up in gtfs
    'T': "trip_phone_coordinated",
    '!': "trip_is_conditional",

    // Stop Info
    'W': "toilet_on_stop_perimeter",
    "w": "toilet_on_stop_perimeter_wheelchair_accessible",
    'x': "on_request_stop",
    '~': "stop_allows_mhd_line_transfers",
    'v': "stop_allows_rail_transfers",
    'b': "stop_allows_bus_transfers",
    'U': "stop_allows_metro_transfers",
    'S': "stop_allows_ship_transfers",
    'J': "stop_is_near_airport",
    'P': "stop_is_near_park_and_ride_system",
    '(': "stop_is_drop_off_only",
    ')': "stop_is_pickup_only",
    '$': "stop_is_a_border_control",
    '}': "stop_is_partially_accessible",
    't': 'stop_has_dedicated_accessible_terminal'

}

module.exports = PevnyKod