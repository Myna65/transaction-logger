export interface Transaction {
  hash: string;
  amount: bigint;
  from: string;
  to: string;
  success: boolean;
}
