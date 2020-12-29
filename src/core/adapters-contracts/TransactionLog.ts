export interface TransactionLog {
  getNumberOfLoggedTransactions(): Promise<number>;
  log(transaction: string): Promise<void>;
  close(): Promise<void>;
}
