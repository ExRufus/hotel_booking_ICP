import { Canister, Principal, query, Record, StableBTreeMap, text, update, Variant, Vec, nat64, Some, Opt } from 'azle';

export const HotelRoomReservation = Record({
    id: Principal,
    guestName: text,
    checkInDate: text,
    checkOutDate: text,
    numberOfGuests: nat64,
    roomType: text,
    amount: nat64,
});

type HotelRoomReservation = typeof HotelRoomReservation.tsType;

export let Rooms = StableBTreeMap<Principal, HotelRoomReservation>(0);

export default Canister({
    /**
     * Adds a hotel room reservation to the Rooms map.
     * @param {text} checkInDate - The check-in date.
     * @param {text} guestName - The guest's name.
     * @param {text} checkOutDate - The check-out date.
     * @param {nat64} amount - The reservation amount.
     * @param {text} roomType - The type of the room.
     * @param {nat64} numberOfGuests - The number of guests.
     * @returns {HotelRoomReservation | string} - The added reservation or an error message.
     */
    addHotelRoomReservation: update([text, text, text, nat64, text, nat64], HotelRoomReservation, (checkInDate, guestName, checkOutDate, amount, roomType, numberOfGuests): HotelRoomReservation | string => {
        try {
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
        } catch (error) {
            // Handle the error and return an appropriate response
            return error.message || "An error occurred while adding the reservation.";
        }
    }),

    /**
     * Gets a list of hotel room reservations.
     * @returns {Vec<HotelRoomReservation>} - The list of room reservations.
     */
    getRoomList: query([], Vec(HotelRoomReservation), () => {
        return Rooms.values();
    }),

    /**
     * Gets details of a specific hotel room reservation.
     * @param {Principal} id - The ID of the reservation.
     * @returns {Opt<HotelRoomReservation>} - The details of the reservation, if found.
     */
    getRoomDetails: query([Principal], Opt(HotelRoomReservation), (id: Principal): Opt<HotelRoomReservation> => {
        const room = Rooms.get(id);
        return room;
    }),
});

/**
 * Generates a random ID using cryptographic principles.
 * @returns {Principal} - The generated ID.
 */
function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}
