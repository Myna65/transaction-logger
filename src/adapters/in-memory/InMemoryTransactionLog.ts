import { TransactionLog } from '../../core/adapters-contracts/TransactionLog';

export class InMemoryTransactionLog implements TransactionLog {
  lines: string[] = [];
  closed = false;

  async getNumberOfLoggedTransactions(): Promise<number> {
    return this.lines.length;
  }

  async log(line: string): Promise<void> {
    this.lines.push(line);
  }

  async close(): Promise<void> {
    this.closed = true;
  }
}
