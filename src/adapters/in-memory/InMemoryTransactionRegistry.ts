import {
  GetTransactionsForAddressInterface,
  TransactionRegistry,
} from '../../core/adapters-contracts/TransactionRegistry';
import { Transaction } from '../../core/domain/Transaction';

export class InMemoryTransactionRegistry implements TransactionRegistry {
  lastRequestedAddress: string | null = null;
  private transactions: Transaction[] = [];

  addTransactions(...transactionsToAdd: Transaction[]): void {
    this.transactions.push(...transactionsToAdd);
  }

  async getTransactionsForAddress(
    params: GetTransactionsForAddressInterface
  ): Promise<Transaction[]> {
    this.lastRequestedAddress = params.address;
    return this.transactions;
  }
}
