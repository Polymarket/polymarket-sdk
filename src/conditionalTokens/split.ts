import { encodeFunctionData, zeroHash } from "viem";
import ConditionalTokensABI from "../abi/ConditionalTokens.json" with { type: "json" };
import { CallType, type Transaction } from "../types.js";

const encodeSplit = (
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: bigint[],
  amount: bigint,
): string =>
  encodeFunctionData({
    abi: ConditionalTokensABI,
    functionName: "splitPosition",
    args: [collateralTokenAddress, parentCollectionId, conditionId, partition, amount],
  });

const splitTransaction = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: bigint[],
  amount: bigint,
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
  // partition: bigint[],
  amount: bigint,
): Transaction[] => {
  const parentCollectionId = zeroHash;
  const partition = Array.from({ length: outcomeSlotCount }, (_: undefined, i: number) => 1n << BigInt(i));
  return [
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
