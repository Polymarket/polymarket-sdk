import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { HashZero } from "@ethersproject/constants";
import ConditionalTokensABI from "../abi/ConditionalTokens.json";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const encodeSplit = (
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: BigNumberish[],
  amount: BigNumberish,
): string =>
  new Interface(ConditionalTokensABI).encodeFunctionData("splitPosition(address,bytes32,bytes32,uint256[],uint256)", [
    collateralTokenAddress,
    parentCollectionId,
    conditionId,
    partition,
    amount,
  ]);

const splitTransaction = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: BigNumberish[],
  amount: BigNumberish,
): Transaction => ({
  to: conditionalTokensAddress,
  typeCode: CallType.Call,
  data: encodeSplit(collateralTokenAddress, parentCollectionId, conditionId, partition, amount),
  value: "0",
});

export const splitPosition = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  // parentCollectionId: string,
  conditionId: string,
  outcomeSlotCount: number,
  // partition: BigNumberish[],
  amount: BigNumberish,
): Transaction[] => {
  // Assume that we're merging a condition which has been split from collateral
  const parentCollectionId = HashZero;
  // Assume that we're mergine a full set of outcome tokens
  // eslint-disable-next-line no-bitwise
  const partition = Array.from({ length: outcomeSlotCount }, (_: undefined, i: number) => 1 << i);
  return [
    erc20ApprovalTransaction(collateralTokenAddress, conditionalTokensAddress, amount),
    splitTransaction(
      conditionalTokensAddress,
      collateralTokenAddress,
      parentCollectionId,
      conditionId,
      partition,
      amount,
    ),
  ];
};
