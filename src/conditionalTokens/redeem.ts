import { encodeFunctionData, zeroHash } from "viem";
import ConditionalTokensABI from "../abi/ConditionalTokens.json" with { type: "json" };
import { CallType, type Transaction } from "../types.js";

const encodeRedeem = (
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: bigint[],
): string =>
  encodeFunctionData({
    abi: ConditionalTokensABI,
    functionName: "redeemPositions",
    args: [collateralTokenAddress, parentCollectionId, conditionId, partition],
  });

const redeemTransaction = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: bigint[],
): Transaction => ({
  to: conditionalTokensAddress,
  typeCode: CallType.Call,
  data: encodeRedeem(collateralTokenAddress, parentCollectionId, conditionId, partition),
  value: "0",
});

export const redeemPositions = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  // parentCollectionId: string,
  conditionId: string,
  outcomeSlotCount: number,
  // partition: bigint[],
): Transaction[] => {
  const parentCollectionId = zeroHash;
  const partition = Array.from({ length: outcomeSlotCount }, (_: undefined, i: number) => 1n << BigInt(i));
  return [
    redeemTransaction(conditionalTokensAddress, collateralTokenAddress, parentCollectionId, conditionId, partition),
  ];
};
