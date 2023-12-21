import { Canister, nat64, Opt, Principal, query, Record, StableBTreeMap, text, update, Variant, Vec } from 'azle';

const HotelRoomReservation = Record({
    id: Principal,
    guestName: text,
    checkInDate: text,
    checkOutDate: text,
    numberOfGuests: nat64,
    roomType: text,
    amount: nat64,
  });

type HotelRoomReservation = typeof HotelRoomReservation.tsType;


const HotelReservationError = Variant({
    RoomTypeNotAvailable: text,
    NoAvailableRooms: text,
});

type HotelReservationError = typeof HotelReservationError.tsType;

let Rooms = StableBTreeMap<Principal, HotelRoomReservation>(0);

export default Canister({

    addHotelRoomReservation: update([text, text, text, nat64, text, nat64], HotelRoomReservation, (checkInDate, guestName, checkOutDate, amount, roomType, numberOfGuests) => {
        const id = generateId();
        const reservation: HotelRoomReservation = {
            id: id,
            guestName: guestName,
            checkInDate: checkInDate,
            checkOutDate: checkOutDate,
            numberOfGuests: numberOfGuests,
            roomType: roomType,
            amount: amount,
          };
          Rooms.insert(id, reservation);
          return reservation;
    }),

    getRoomList: query([], Vec(HotelRoomReservation), () => {
        return Rooms.values();
    }),

    getRoomDetails: query([Principal], Opt(HotelRoomReservation), (id) => {
        return Rooms.get(id);
    }),

    // inquiry: query([Principal], nat64, (Principal) => {
    //     return Rooms(.get(Principal));
    // })


})

function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}