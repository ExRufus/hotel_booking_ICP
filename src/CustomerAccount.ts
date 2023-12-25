import { Canister, Opt, Principal, Record, StableBTreeMap, Vec, nat64, query, text, update } from "azle";

export const Customer = Record({
    id: Principal,
    guestName: text,
    amount: nat64,
});
type Customer = typeof Customer.tsType;

export let customers = StableBTreeMap<Principal, Customer>(0);

export default Canister({
    /**
     * Creates a new customer with the provided guestName and amount.
     * @param {text} guestName - The guest's name.
     * @param {nat64} amount - The amount associated with the customer.
     * @returns {Customer | string} - The created customer or an error message.
     */
    createUser: update([text, nat64], Customer, (guestName, amount): Customer | string => {
        try {
            const id = generateId();
            const customer: Customer = {
                id,
                guestName: guestName,
                amount: amount,
            };
            customers.insert(customer.id, customer);
            return customer;
        } catch (error) {
            // Handle the error and return an appropriate response
            return error.message || "An error occurred while creating the user.";
        }
    }),

    /**
     * Retrieves a list of all customers.
     * @returns {Vec<Customer>} - The list of customers.
     */
    readCustomers: query([], Vec(Customer), () => {
        return customers.values();
    }),

    /**
     * Retrieves customer details by ID.
     * @param {Principal} id - The ID of the customer.
     * @returns {Opt<Customer>} - The details of the customer, if found.
     */
    readCustomerId: query([Principal], Opt(Customer), (id: Principal): Opt<Customer> => {
        return customers.get(id);
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
