# Package RoadMap

## General
- [x] allow for Entity Added Data Request (calls a function which allows to edit entity data when being generated)
- [ ] Tariff zones support
- [ ] allow to add ungeneratable fields/files on fly (i.e. GTFS Fares)
- [ ] allow to generate data from `Mistenky`
- [ ] allow to generate data from `Udaje`
- [ ] allow for backwards compatibility with older JDF versions
- [ ] support reading unknown CSV files with locations
- [ ] support GTFS `networks.txt`
- [ ] support more PevnyKod entities
- [ ] support ability to add translations
- [ ] (maybe) split jdf reader into separate package
- [ ] (future) allow for foreign Entity IDs for feed mergers
- [ ] (maybe) support JDF `spojdat`, `zony`, `zonylinky`, `udajezaslinky`
- [ ] generation of report of warnings and errors
- [ ] follow spec designer best practises (see https://gtfs.org/documentation/schedule/schedule-best-practices/)
- [ ] (maybe) add support to generate GTFS-Flex
- [ ] add overrides by id for every entity
- [ ] check if IDs exist in generators

## Stops
- [ ] use `Oznacniky` for automatic detection of Platforms and asign them found Coordinates
- [x] fix platform generation
- [x] Platform `stop_name` generation should follow best practises set by the Standard
- [ ] allow for on-the-fly generation of non-stop/non-platform entities
- [x] **fix stop generation**

## Routes
- [x] allow for predetermined route_short_name change using a config
- [x] allow for optional setting of Extended GTFS Route types (see https://developers.google.com/transit/gtfs/reference/extended-route-types)
- [ ] allow to generate `AltLinky` properties if wished by the feed consumer
- [x] **fix colors**

## Trips
- [x] allow for automatic direction_id asumption
- [x] allow for `exceptional` field in `trips.txt` (see https://developers.google.com/transit/gtfs/reference/extended-route-types#flexible-route-types)

## Stop Times
- [x] fix stop time platform usage
- [ ] allow for PevnyKod `§`, `A`, `B` and `C` properties
- [ ] allow for PevnyKod `!` property

## Calendar / Calendar Dates
- [ ] support odd/even week schedule
- [ ] support allowed/disallowed bike transfer on board (acording to CasKody) 
- [ ] allow for usage of `Altdop`
- [ ] Throw errors on `NEPOVOLENÉ KOMBINACE Typů časových kódů uvedených v tabulce`
- [ ] add support for gtfs `service_name` field
- [x] get to know how JDF producers are able to generate `ide od 1.I. x X`
- [ ] allow for Czech holidays
- [ ] test alot
- [ ] **!!! in main class allow for dstruction of specific GTFS Calendar** (to satisfy `CasKodTyp.ONLY_GOES`)

## Transfers
- [ ] allow to generate data from `Navaznosti` (including for unknown routes)
- [ ] support reading data used by IDOS/CP.sk to create GTFS `transfers.txt` [see this document](https://adm.dpmmartin.sk/pdf/file_202310119626.pdf) ([or at archive.org](https://web.archive.org/web/20260503135911/https://adm.dpmmartin.sk/pdf/file_202310119626.pdf))