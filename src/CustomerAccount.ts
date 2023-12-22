import { Canister, Opt, Principal, Record, StableBTreeMap, Vec, nat64, query, text, update } from "azle";

export const Customer = Record({
    id: Principal,
    guestName: text,
    amount: nat64,
});
type Customer = typeof Customer.tsType;

export let customers = StableBTreeMap<Principal, Customer>(0);

export default Canister({
    createUser: update([text, nat64], Customer, (guestName, amount) => {
        const id = generateId();
        const customer : Customer = {
            id,
            guestName: guestName,
            amount: amount,
        };
        customers.insert(customer.id, customer);

        return customer;
    }),
    readCustomers: query([], Vec(Customer), () => {
        return customers.values();
    }),
    readCustomerId: query([Principal], Opt(Customer), (id) => {
        return customers.get(id);
    }),
});

function generateId(): Principal {
    const randomBytes = new Array(29)
        .fill(0)
        .map((_) => Math.floor(Math.random() * 256));

    return Principal.fromUint8Array(Uint8Array.from(randomBytes));
}