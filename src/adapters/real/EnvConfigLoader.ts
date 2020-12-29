import { ConfigLoader } from '../../core/adapters-contracts/ConfigLoader';
import { Config } from '../../core/Config';

export class EnvConfigLoader implements ConfigLoader {
  loadConfig(): Config {
    return {
      ETHERSCAN_API_ENDPOINT:
        process.env.ETHERSCAN_ENDPOINT ||
        'https://api-ropsten.etherscan.io/api',
      ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY || '',
      LOG_FILE_PATH: process.env.OUTPUT_PATH || 'OUTPUT.txt',
      UPDATE_INTERVAL: process.env.UPDATE_INTERVAL ? parseInt(process.env.UPDATE_INTERVAL) : 15,
    };
  }
}
