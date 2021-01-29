import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import ConditionalTokensABI from "../abi/ConditionalTokens.json";
import { CallType, Transaction } from "../types";

const encodeMerge = (
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: BigNumberish[],
  amount: BigNumberish,
): string =>
  new Interface(ConditionalTokensABI).encodeFunctionData("mergePositions(address,bytes32,bytes32,uint256[],uint256)", [
    collateralTokenAddress,
    parentCollectionId,
    conditionId,
    partition,
    amount,
  ]);

const mergeTransaction = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: BigNumberish[],
  amount: BigNumberish,
): Transaction => ({
  to: conditionalTokensAddress,
  typeCode: CallType.Call,
  data: encodeMerge(collateralTokenAddress, parentCollectionId, conditionId, partition, amount),
  value: "0",
});

export const mergePositions = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  // parentCollectionId: string,
  conditionId: string,
  outcomeSlotCount: number,
  // partition: BigNumberish[],
  amount: BigNumberish,
): Transaction[] => {
  // Assume that we're merging a condition which has been split from collateral
  const parentCollectionId = `0x${"0".repeat(64)}`;
  // Assume that we're mergine a full set of outcome tokens
  // eslint-disable-next-line no-bitwise
  const partition = Array.from({ length: outcomeSlotCount }, (_: undefined, i: number) => 1 << i);
  return [
    mergeTransaction(
      conditionalTokensAddress,
      collateralTokenAddress,
      parentCollectionId,
      conditionId,
      partition,
      amount,
    ),
  ];
};
