import { TransactionLog } from '../../core/adapters-contracts/TransactionLog';
import { createReadStream, existsSync } from 'fs';
import { FileHandle, open } from 'fs/promises';

export class FileTransactionLog implements TransactionLog {
  private fileDescriptor: FileHandle | null = null;

  constructor(private config: FileTransactionLogConfig) {}

  getNumberOfLoggedTransactions(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      if (!existsSync(this.config.LOG_FILE_PATH)) {
        resolve(0);
        return;
      }
      let count = 0;
      createReadStream(this.config.LOG_FILE_PATH)
        .on('data', (chunk) => {
          for (let i = 0; i < chunk.length; i++) {
            if (chunk[i] === 10) {
              count++;
            }
          }
        })
        .on('end', () => {
          resolve(count);
        })
        .on('error', reject);
    });
  }

  async log(line: string): Promise<void> {
    if (this.fileDescriptor === null) {
      this.fileDescriptor = await open(this.config.LOG_FILE_PATH, 'a');
    }

    await this.fileDescriptor.appendFile(`${line}\n`);
    await this.fileDescriptor.sync();
  }

  async close(): Promise<void> {
    await this.fileDescriptor?.close();
    this.fileDescriptor = null;
  }
}

export interface FileTransactionLogConfig {
  LOG_FILE_PATH: string;
}
