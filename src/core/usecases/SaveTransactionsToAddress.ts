import { TransactionRegistry } from '../adapters-contracts/TransactionRegistry';
import { TransactionLog } from '../adapters-contracts/TransactionLog';

export interface SaveTransactionsToAddressRequest {
  address: string;
}

export class SaveTransactionsToAddressUseCase {
  constructor(private deps: SaveTransactionsToAddressDependencies) {}

  async execute({ address }: SaveTransactionsToAddressRequest): Promise<void> {
    const numberOfLoggedTxs = await this.deps.transactionLog.getNumberOfLoggedTransactions();
    const transactions = await this.deps.transactionRegistry.getTransactionsForAddress(
      { address }
    );
    const validTransactions = transactions
      .filter((tx) => tx.to === address.toLowerCase())
      .filter((tx) => tx.amount > 0n)
      .filter((tx) => tx.success)
      .slice(numberOfLoggedTxs);
    for (const tx of validTransactions) {
      await this.deps.transactionLog.log(`MINT ${tx.amount} ${tx.from}`);
    }
    await this.deps.transactionLog.close();
  }
}

export interface SaveTransactionsToAddressDependencies {
  transactionLog: TransactionLog;
  transactionRegistry: TransactionRegistry;
}
