import { Transaction } from '../domain/Transaction';

export interface TransactionRegistry {
  getTransactionsForAddress(
    params: GetTransactionsForAddressInterface
  ): Promise<Transaction[]>;
}

export interface GetTransactionsForAddressInterface {
  address: string;
}
