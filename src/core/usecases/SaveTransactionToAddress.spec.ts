import { SaveTransactionsToAddressUseCase } from './SaveTransactionsToAddress';
import { InMemoryTransactionRegistry } from '../../adapters/in-memory/InMemoryTransactionRegistry';
import { InMemoryTransactionLog } from '../../adapters/in-memory/InMemoryTransactionLog';
import { Transaction } from '../domain/Transaction';

describe('When requested to save all transactions to an address to log', () => {
  let transactionRegistry: InMemoryTransactionRegistry | null = null;
  let transactionLog: InMemoryTransactionLog | null = null;
  let usecase: SaveTransactionsToAddressUseCase | null = null;
  beforeEach(() => {
    transactionRegistry = new InMemoryTransactionRegistry();
    transactionLog = new InMemoryTransactionLog();
    usecase = new SaveTransactionsToAddressUseCase({
      transactionLog,
      transactionRegistry,
    });
  });

  const address = '0x1234568901234567890123456789012345678901234567890';
  const anotherAddress = '0x1234568901234567890123456789012345678901234567891';

  const successfulTransaction: Transaction = {
    hash: '0x17434',
    from: anotherAddress,
    to: address,
    amount: 1000n,
    success: true,
  };

  it('It should request the transaction for the specific address', async () => {
    await usecase?.execute({ address });
    expect(transactionRegistry?.lastRequestedAddress).toEqual(address);
  });

  it('It should log successful transaction to the correct address with an amount', async () => {
    transactionRegistry?.addTransactions(successfulTransaction);
    await usecase?.execute({ address });
    expect(transactionLog?.lines).toHaveLength(1);
  });

  it('It should not log transactions from this address', async () => {
    transactionRegistry?.addTransactions({
      ...successfulTransaction,
      from: address,
      to: anotherAddress,
    });
    await usecase?.execute({ address });
    expect(transactionLog?.lines).toHaveLength(0);
  });

  it('It should not log failed transactions', async () => {
    transactionRegistry?.addTransactions({
      ...successfulTransaction,
      success: false,
    });
    await usecase?.execute({ address });
    expect(transactionLog?.lines).toHaveLength(0);
  });

  it('It should not log transactions without ETH', async () => {
    transactionRegistry?.addTransactions({
      ...successfulTransaction,
      amount: 0n,
    });
    await usecase?.execute({ address });
    expect(transactionLog?.lines).toHaveLength(0);
  });

  it('The number of valid transaction logged should match the number of valid transaction in the registry', async () => {
    transactionRegistry?.addTransactions(successfulTransaction, successfulTransaction);
    transactionLog?.lines.push('');
    await usecase?.execute({ address });
    expect(transactionLog?.lines).toHaveLength(2);
  });

  it('The output format used to log should match the expected one', async () => {
    transactionRegistry?.addTransactions(successfulTransaction);
    await usecase?.execute({ address });
    const expectedFormat = `MINT ${successfulTransaction.amount} ${successfulTransaction.from.toLowerCase()}`
    expect(transactionLog?.lines[0]).toEqual(expectedFormat);
  });
});
