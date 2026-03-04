import { encodeFunctionData } from "viem";
import ConditionalTokensABI from "../abi/ConditionalTokens.json";
import { CallType, Transaction } from "../types";

const encodeMerge = (
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: bigint[],
  amount: bigint,
): string =>
  encodeFunctionData({
    abi: ConditionalTokensABI,
    functionName: "mergePositions",
    args: [collateralTokenAddress, parentCollectionId, conditionId, partition, amount],
  });

const mergeTransaction = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: bigint[],
  amount: bigint,
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
  // partition: bigint[],
  amount: bigint,
): Transaction[] => {
  const parentCollectionId = `0x${"0".repeat(64)}`;
  // eslint-disable-next-line no-bitwise
  const partition = Array.from({ length: outcomeSlotCount }, (_: undefined, i: number) => BigInt(1 << i));
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
