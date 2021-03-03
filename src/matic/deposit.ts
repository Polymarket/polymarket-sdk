import { defaultAbiCoder, Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

export { isRootTxStateSynced as isDepositComplete } from "@tomfrench/matic-proofs";

const encodeMaticDeposit = (
  recipientAddress: string,
  mainnetTokenAddress: string,
  tokenDeposit: BigNumberish,
): string =>
  new Interface(["function depositFor(address,address,bytes)"]).encodeFunctionData(
    "depositFor(address,address,bytes)",
    [recipientAddress, mainnetTokenAddress, defaultAbiCoder.encode(["uint256"], [tokenDeposit])],
  );

const maticErc20DepositTransaction = (
  rootChainManagerProxy: string,
  tokenAddress: string,
  recipientAddress: string,
  amount: BigNumberish,
): Transaction => ({
  to: rootChainManagerProxy,
  typeCode: CallType.Call,
  data: encodeMaticDeposit(recipientAddress, tokenAddress, amount),
  value: "0",
});

export const depositFundsIntoMatic = (
  maticBridgeAddresses: { rootChainManagerProxy: string; erc20PredicateProxy: string },
  recipientAddress: string,
  tokenAddress: string,
  depositAmount: BigNumberish,
): Transaction[] => {
  const { rootChainManagerProxy, erc20PredicateProxy } = maticBridgeAddresses;
  return [
    erc20ApprovalTransaction(tokenAddress, erc20PredicateProxy, depositAmount),
    maticErc20DepositTransaction(rootChainManagerProxy, tokenAddress, recipientAddress, depositAmount),
  ];
};
