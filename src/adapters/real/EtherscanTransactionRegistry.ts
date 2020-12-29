import {
  GetTransactionsForAddressInterface,
  TransactionRegistry,
} from '../../core/adapters-contracts/TransactionRegistry';
import { Transaction } from '../../core/domain/Transaction';
import axios from 'axios';

export class EtherscanTransactionRegistry implements TransactionRegistry {
  constructor(private config: EtherscanConfig) {}

  async getTransactionsForAddress(
    params: GetTransactionsForAddressInterface
  ): Promise<Transaction[]> {
    const res = await axios.get(this.config.ETHERSCAN_API_ENDPOINT, {
      params: {
        module: 'account',
        action: 'txlist',
        address: params.address,
        apiKey: this.config.ETHERSCAN_API_KEY,
      },
    });
    if (res.data.status !== '1') {
      // Etherscan returns 200 on rate limit error instead of 429
      throw new Error(
        `Etherscan failed with code ${res.data.message} (${res.data.result})`
      );
    }
    return res.data.result.map((r: any) => ({
      hash: r.hash,
      from: r.from,
      to: r.to,
      amount: BigInt(r.value),
      success: r.isError === '0',
    }));
  }
}

export interface EtherscanConfig {
  ETHERSCAN_API_ENDPOINT: string;
  ETHERSCAN_API_KEY: string;
}
