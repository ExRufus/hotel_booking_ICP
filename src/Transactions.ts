import { Canister, Principal, nat64, text, update, Some } from 'azle';
import * as CustomerAccount from './CustomerAccount';

export default Canister({
  addBalance: update([Principal, nat64], text, (principal, amount) => {
    const { customers } = CustomerAccount;

    const customer = customers.get(principal);

    if (customer) {
      const currentAmount = customer.Some?.amount;

      if (currentAmount !== undefined) {
        try {
          const newAmount = currentAmount + amount;

          customers.insert(principal, {
            id: principal,
            guestName: '',
            amount: newAmount,
          });

          return `Balance added successfully. New balance: ${newAmount} current Balance ${amount}`;
        } catch (error) {
          // Handle the error and return an appropriate response
          return `An error occurred: ${error.message || "Unknown error"}`;
        }
      } else {
        return 'Customer data is incomplete. New balance: ${newAmount} current Balance ${amount}';
      }
    } else {
      return 'Customer not found';
    }
  }),
});
