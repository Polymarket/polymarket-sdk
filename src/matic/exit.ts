import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import {
  buildPayloadForExit,
  encodePayload,
  isBurnTxCheckpointed as checkExitIsCheckpointed,
  EventSignature,
  isBurnTxClaimable,
} from "@tomfrench/matic-proofs";
import { CallType, Transaction } from "../types";

const encodeExit = (exitData: BigNumberish): string =>
  new Interface(["function exit(bytes)"]).encodeFunctionData("exit(bytes)", [exitData]);

/**
 * @notice Generates the transaction object for an exit transaction to be send to the proxy wallet
 * @param rootChainProvider - The provider used for querying the root chain
 * @param maticChainProvider - The provider used for querying the child chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHash - the burn transaction hash corresponding to the withdrawal
 */
const exitTransaction = async (
  rootChainProvider: Provider,
  maticChainProvider: JsonRpcProvider,
  rootChainManagerAddress: string,
  burnTxHash: string,
): Promise<Transaction> => {
  const exitPayload = await buildPayloadForExit(
    rootChainProvider,
    maticChainProvider,
    rootChainManagerAddress,
    burnTxHash,
    EventSignature.ERC20Transfer,
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
 * @param rootChainProvider - The provider used for querying the root chain
 * @param maticChainProvider - The JSONRpcProvider used for querying the child chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHashes - an array of burn transaction hashes corresponding to withdrawals
 */
export const multipleExitFundsFromMatic = async (
  rootChainProvider: Provider,
  maticChainProvider: JsonRpcProvider,
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
 * @param rootChainProvider - The provider used for querying the root chain
 * @param maticChainProvider - The JSONRpcProvider used for querying the child chain
 * @param rootChainManagerAddress - The address of the rootchain manager contract
 * @param burnTxHash - the burn transaction hash corresponding to the withdrawal
 */
export const exitFundsFromMatic = async (
  rootChainProvider: Provider,
  maticChainProvider: JsonRpcProvider,
  rootChainManagerAddress: string,
  burnTxHash: string,
): Promise<Transaction[]> =>
  multipleExitFundsFromMatic(rootChainProvider, maticChainProvider, rootChainManagerAddress, [burnTxHash]);

/**
 * Check whether a withdrawal has been processed on the root chain
 * @param rootChainProvider - a Provider for the root chain (Ethereum)
 * @param maticChainProvider - a JSONRpcProvider for the child chain (Matic)
 * @param rootChainContractAddress - The address of the rootChainManager contract
 * @param burnTxHash - The hash of the transaction of interest on the child chain
 * @param logEventSig - The event signature for the log to check for
 * @param exitProcessorAddress - The address of the contract which tracks whether this exit has been processed
 */
export const checkExitIsValid = (
  rootChainProvider: Provider,
  maticChainProvider: JsonRpcProvider,
  rootChainContractAddress: string,
  burnTxHash: string,
): Promise<boolean> =>
  isBurnTxClaimable(
    rootChainProvider,
    maticChainProvider,
    rootChainContractAddress,
    burnTxHash,
    EventSignature.ERC20Transfer,
  );

// re-export helper function from @tomfrench/matic-proofs for checking whether exit is checkpointed
export { checkExitIsCheckpointed };
