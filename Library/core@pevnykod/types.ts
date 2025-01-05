export type PevnyKodEnum = PevnyKodTripExecution | PevnyKodTripModificators | PevnyKodStopAttributes

export enum PevnyKodTripExecution {

	OnlyWorkdays			= "X",		// @ jede v pracovních dnech
	OnlyFreedays			= "+",		// @ jede v neděli a ve státem uznané svátky
	OnlyMondays				= '1',		// @ jede v pondělí
	OnlyTuesdays			= '2', 		// @ jede v úterý
	OnlyWednesdays			= '3',		// @ jede ve středu
	OnlyThursdays			= '4',		// @ jede ve čtvrtek
	OnlyFridays				= '5',		// @ jede v pátek
	OnlySaturdays			= '6',		// @ jede v sobotu
	OnlySundays				= '7',		// @ jede v neděli

}

export enum PevnyKodTripModificators {
	CanReserveSeatOnTrip	= "R",
	MustReserveSeatOnTrip	= "#",
	TripIsAccessible		= "@",
	TripHasFoodService		= "%",
	MustArrangeWithAgency	= "T",
	TripAllowsBikes			= "O",
}

export enum PevnyKodStopAttributes {
	OnRequest				= "x",
	DropOffOnly				= "(",
	PickUpOnly				= ")",
	IsBorderCheck			= "$",
	MustArrangeWithAgency	= "T",
}