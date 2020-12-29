import { SaveTransactionsToAddressUseCase } from './core/usecases/SaveTransactionsToAddress';
import { EtherscanTransactionRegistry } from './adapters/real/EtherscanTransactionRegistry';
import { FileTransactionLog } from './adapters/real/FileTransactionLog';
import { EnvConfigLoader } from './adapters/real/EnvConfigLoader';

const configLoader = new EnvConfigLoader();
const config = configLoader.loadConfig();

if (process.argv.length < 3 || process.argv[2].length !== 42) {
  console.log('Usage: npm run minter <address>');
  process.exit(1);
}
const address = process.argv[2];

const transactionLog = new FileTransactionLog(config);
const transactionRegistry = new EtherscanTransactionRegistry(config);
const usecase = new SaveTransactionsToAddressUseCase({
  transactionLog,
  transactionRegistry,
});

let gracefulShutdownRequested = false;
let timeout: ReturnType<typeof setTimeout> | null = null;

const processIteration = () => {
  usecase
    .execute({ address })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      if (!gracefulShutdownRequested)
        timeout = setTimeout(processIteration, config.UPDATE_INTERVAL * 1000);
    });
};

const gracefulShutdown = () => {
  gracefulShutdownRequested = true;
  if (timeout) clearTimeout(timeout);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

processIteration();
