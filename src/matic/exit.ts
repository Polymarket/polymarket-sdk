import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { JsonRpcProvider, Provider } from "@ethersproject/providers";
import {
  buildPayloadForExit,
  encodePayload,
  isBurnTxClaimable as checkExitIsValid,
  ERC20_TRANSFER_EVENT_SIG,
  isBurnTxCheckpointed as checkExitIsCheckpointed,
} from "@tomfrench/matic-proofs";
import { CallType, Transaction } from "../types";

// re-export helper functions from @tomfrench/matic-proofs for checking whether exit can be claimed
export { checkExitIsCheckpointed, checkExitIsValid };

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
