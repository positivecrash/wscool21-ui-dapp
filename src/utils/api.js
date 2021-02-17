import { ApiPromise, WsProvider } from "@polkadot/api";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress
} from "@polkadot/extension-dapp";
import { Keyring } from "@polkadot/keyring";

export const config = {
  endpoint: "ws://localhost:9944",
  types: {
    Address: "MultiAddress",
    LookupSource: "MultiAddress",
    Record: "Vec<u8>",
    Parameter: "Bool",
    EverUSDBalance: "u64",
    BondPeriod: "u32",
    BondId: "u32"
  }
};

let api;
export async function initApi() {
  const provider = new WsProvider(config.endpoint);
  api = await ApiPromise.create({
    provider,
    types: config.types
  });
  return api;
}

export function getApi() {
  return api;
}

async function getExtension() {
  const extensions = await web3Enable("demo");
  if (extensions.length === 0) throw new Error("no extension");
  return extensions[0];
}

export async function initAccount(index = 0) {
  const timeout = new Promise(resolve => {
    setTimeout(resolve, 1700);
  });
  await timeout;
  await getExtension();
  const accounts = await web3Accounts();
  if (accounts.length > 0) {
    const injector = await web3FromAddress(accounts[index].address);
    api.setSigner(injector.signer);
    return accounts[index].address;
  }
  throw new Error("no accounts");
}

export function getBalance(account, cb) {
  api.query.system.account(account, ({ data: { free: currentFree } }) => {
    cb(currentFree);
  });
}

export const keyring = new Keyring({ type: "sr25519" });

export async function faucet(address) {
  keyring.setSS58Format(api.registry.chainSS58);
  const account = keyring.addFromUri("//Alice");
  const tx = api.tx.balances.transfer(address, 1000000000000000);
  await tx.signAndSend(account);
}
