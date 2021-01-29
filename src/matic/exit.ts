import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { JsonRpcProvider } from "@ethersproject/providers";
import {
  buildPayloadForExit,
  encodePayload,
  isBurnTxClaimable,
  ERC20_TRANSFER_EVENT_SIG,
  isBurnTxCheckpointed,
} from "@tomfrench/matic-proofs";
import { CallType, Transaction } from "../types";
import { erc20TransferTransaction } from "../utils";

const encodeExit = (exitData: BigNumberish): string =>
  new Interface(["function exit(bytes)"]).encodeFunctionData("exit(bytes)", [exitData]);

/**
 * @notice Generates the transaction object for an exit transaction to be send to the proxy wallet
 * @param rootChainProviderUrl - The url of the JSONRpcProvider used for querying the root chain
 * @param maticChainProviderUrl - The url of the JSONRpcProvider used for querying the child chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHash - the burn transaction hash corresponding to the withdrawal
 */
const exitTransaction = async (
  rootChainProviderUrl: string,
  maticChainProviderUrl: string,
  rootChainManagerAddress: string,
  burnTxHash: string,
): Promise<Transaction> => {
  const exitPayload = await buildPayloadForExit(
    new JsonRpcProvider(rootChainProviderUrl),
    new JsonRpcProvider(maticChainProviderUrl),
    rootChainManagerAddress,
    burnTxHash,
    ERC20_TRANSFER_EVENT_SIG,
  );
  return {
    to: rootChainManagerAddress,
    typeCode: CallType.Call,
    data: encodeExit(encodePayload(exitPayload)),
    value: "0",
  };
};

/**
 * @notice Submits multiple withdrawal proofs to the mainnet Matic contracts claiming the funds to the users proxyWallet
 * @param rootChainProviderUrl - The url of the JSONRpcProvider used for querying the root chain
 * @param maticChainProviderUrl - The url of the JSONRpcProvider used for querying the child chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHashes - an array of burn transaction hashes corresponding to withdrawals
 */
export const multipleExitFundsFromMatic = async (
  rootChainProvider: string,
  maticChainProvider: string,
  rootChainManagerAddress: string,
  burnTxHashes: string[],
): Promise<Transaction[]> =>
  Promise.all(
    burnTxHashes.map(burnTxHash =>
      exitTransaction(rootChainProvider, maticChainProvider, rootChainManagerAddress, burnTxHash),
    ),
  );

/**
 * @notice Submits a withdrawal proof to the mainnet Matic contracts claiming the funds to the users proxyWallet
 * @param rootChainProviderUrl - The url of the JSONRpcProvider used for querying the root chain
 * @param maticChainProviderUrl - The url of the JSONRpcProvider used for querying the child chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHash - the burn transaction hash corresponding to the withdrawal
 */
export const exitFundsFromMatic = async (
  rootChainProvider: string,
  maticChainProvider: string,
  rootChainManagerAddress: string,
  burnTxHash: string,
): Promise<Transaction[]> =>
  multipleExitFundsFromMatic(rootChainProvider, maticChainProvider, rootChainManagerAddress, [burnTxHash]);

/**
 * @deprecated
 * @param rootChainProvider - The url of the JSONRpcProvider used for querying the root chain
 * @param maticChainProvider - The url of the JSONRpcProvider used for querying the root chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHash - the transaction hash to be tested
 * @param recipientAddress - the address to forward the withdrawn funds to
 * @param expectedWithdrawalAmount - the amount in wei of withdrawn funds to transfer to recipientAddress
 */
export const exitFundsFromMaticAndForward = async (
  rootChainProviderUrl: string,
  maticChainProviderUrl: string,
  rootChainManagerAddress: string,
  burnTxHash: string,
  tokenAddress: string,
  recipientAddress: string,
  expectedWithdrawalAmount: BigNumberish,
): Promise<Transaction[]> => {
  return Promise.all([
    exitTransaction(rootChainProviderUrl, maticChainProviderUrl, rootChainManagerAddress, burnTxHash),
    erc20TransferTransaction(tokenAddress, recipientAddress, expectedWithdrawalAmount),
  ]);
};

/**
 * @notice Checks whether the provided burn transaction hash is included in a checkpoint
 * @param rootChainProviderUrl - The url of the JSONRpcProvider used for querying the root chain
 * @param maticChainProviderUrl - The url of the JSONRpcProvider used for querying the child chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHash - the transaction hash to be tested
 */
export const checkExitIsCheckpointed = async (
  rootChainProviderUrl: string,
  maticChainProviderUrl: string,
  rootChainManagerAddress: string,
  burnTxHash: string,
): Promise<boolean> =>
  isBurnTxCheckpointed(
    new JsonRpcProvider(rootChainProviderUrl),
    new JsonRpcProvider(maticChainProviderUrl),
    rootChainManagerAddress,
    burnTxHash,
  );

/**
 * @notice Checks whether the provided burn transaction hash is able to be successfully claimed.
 *         i.e. whether it is included in a checkpoint and hasn't already been claimed.
 * @param rootChainProviderUrl - The url of the JSONRpcProvider used for querying the root chain
 * @param maticChainProviderUrl - The url of the JSONRpcProvider used for querying the child chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHash - the transaction hash to be tested
 */
export const checkExitIsValid = async (
  rootChainProviderUrl: string,
  maticChainProviderUrl: string,
  rootChainManagerAddress: string,
  burnTxHash: string,
): Promise<boolean> =>
  isBurnTxClaimable(
    new JsonRpcProvider(rootChainProviderUrl),
    new JsonRpcProvider(maticChainProviderUrl),
    rootChainManagerAddress,
    burnTxHash,
    ERC20_TRANSFER_EVENT_SIG,
  );
