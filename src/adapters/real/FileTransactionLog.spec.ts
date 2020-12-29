import { FileTransactionLog } from './FileTransactionLog';
import { readFile, rm, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

describe('FileTransactionLog', () => {
  const path = 'tmp.log';
  let log: FileTransactionLog | null = null;

  beforeEach(() => {
    log = new FileTransactionLog({
      LOG_FILE_PATH: path,
    });
  });

  it('should properly log to a file', async () => {
    await log?.log('Line #1');
    await log?.log('line n°2');
    const fileContent = await readFile(path);
    expect(fileContent.toString()).toEqual('Line #1\nline n°2\n');
  });

  describe('should properly count lines', () => {
    it('when the file does not exists', async () => {
      expect(await log?.getNumberOfLoggedTransactions()).toEqual(0);
    });

    it('when the file is empty', async () => {
      await writeFile(path, '');
      expect(await log?.getNumberOfLoggedTransactions()).toEqual(0);
    });

    it('when one line of data is logged', async () => {
      await log?.log('Test');
      expect(await log?.getNumberOfLoggedTransactions()).toEqual(1);
    });

    it('when multiple lines of data are logged', async () => {
      await log?.log('Line 1');
      await log?.log('Line 2');
      await log?.log('One more line');
      expect(await log?.getNumberOfLoggedTransactions()).toEqual(3);
    });
  });

  afterEach(async () => {
    await log?.close();
    if (existsSync(path)) await rm(path);
  });
});
