import { Canister, Principal, nat64, text, update, Some } from 'azle';
import * as CustomerAccount from './CustomerAccount';

export default Canister({
  addBalance: update([Principal, nat64], text, (principal, amount) => {
    const { customers } = CustomerAccount;

    const customer = customers.get(principal);

    if (customer) {
      const currentAmount = customer.Some?.amount;

      if (currentAmount != undefined) {
        const newAmount = currentAmount + amount;

        // Perbarui customer dengan nilai baru
        customers.insert(principal, {
          id: principal,
          guestName: '',
          amount: newAmount,
        });

        return `Balance added successfully. New balance: ${newAmount}`;
      } else {
        return 'Customer data is incomplete';
      }
    } else {
      return 'Customer not found';
    }
  }),
});