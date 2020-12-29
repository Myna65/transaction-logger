import { EtherscanTransactionRegistry } from './EtherscanTransactionRegistry';

describe('EtherscanTransactionRegistry', () => {
  const transactionsOn0x4261 = [
    {
      from: '0x687422eea2cb73b5d3e242ba5456b782919afc85',
      to: '0x4261b94526920af02d6f4a8f4289400ee7993bfb',
      amount: 1000000000000000000n,
      hash:
        '0x6055d3a9973412a83069fd5392789b672b80d639e276cff766caf5db0b8ad50a',
      success: true,
    },
    {
      from: '0x366f3ba8a295170850ed3810deb0d9a81e214e43',
      to: '0x4261b94526920af02d6f4a8f4289400ee7993bfb',
      amount: 1234500000000000000n,
      hash:
        '0xa7171808e2e500b49a2c30eb1b3dae1929f21eda12c011233eb517fe34233b9c',
      success: true,
    },
    {
      from: '0x78c115f1c8b7d0804fbdf3cf7995b030c512ee78',
      to: '0x4261b94526920af02d6f4a8f4289400ee7993bfb',
      amount: 5000000000000000000n,
      hash:
        '0x769fa9aa30f5ea234944c9e9d4c7935f497435af8bec681ce2e830967bb3f61e',
      success: true,
    },
    {
      from: '0x4261b94526920af02d6f4a8f4289400ee7993bfb',
      to: '0x366f3ba8a295170850ed3810deb0d9a81e214e43',
      amount: BigInt('7233177000000000000'),
      hash:
        '0x508add1594174c9dd59c472c09d1ca0d2bad4d36f94cc2df67edb957b6c91b0e',
      success: true,
    },
  ];

  const transactionsOn0xc748 = [
    {
      from: '0x366f3ba8a295170850ed3810deb0d9a81e214e43',
      to: '',
      amount: 0n,
      hash:
        '0x331423885c0e87eee769c65c0e6a22c87f63cc049eac515e3534ae59433b20a1',
      success: true,
    },
    {
      from: '0x366f3ba8a295170850ed3810deb0d9a81e214e43',
      to: '0xc7487d45fc7802cb3e81b22688b09ef14400bd5a',
      amount: 100000000000000000n,
      hash:
        '0x65cce1299bbb62462840732f9cf2280239047741dc8379256618b918be75e76e',
      success: false,
    },
    {
      from: '0x366f3ba8a295170850ed3810deb0d9a81e214e43',
      to: '0xc7487d45fc7802cb3e81b22688b09ef14400bd5a',
      amount: 100000000000000000n,
      hash:
        '0xe35d839e20c243343557e3735dfffda1920e3e6542ca921c88d43132e5bdeb4e',
      success: true,
    },
  ];

  let registry: EtherscanTransactionRegistry | null;

  beforeEach(() => {
    registry = new EtherscanTransactionRegistry({
      // An API key is needed in order to run this test suite at full speed
      ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY || '',
      ETHERSCAN_API_ENDPOINT: 'https://api-ropsten.etherscan.io/api',
    });
  });

  it('It should properly parse successful transactions', async () => {
    const transactions = await registry?.getTransactionsForAddress({
      address: '0x4261b94526920aF02D6f4a8F4289400Ee7993BFb',
    });
    expect(transactions).toEqual(transactionsOn0x4261);
  });

  it('It should properly parse failed transactions', async () => {
    const transactions = await registry?.getTransactionsForAddress({
      address: '0xc7487d45fc7802cb3e81b22688b09ef14400bd5a',
    });
    expect(transactions).toEqual(transactionsOn0xc748);
  });
});
