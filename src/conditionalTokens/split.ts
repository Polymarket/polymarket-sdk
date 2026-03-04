import { encodeFunctionData, zeroHash } from "viem";
import ConditionalTokensABI from "../abi/ConditionalTokens.json";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

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
  // eslint-disable-next-line no-bitwise
  const partition = Array.from({ length: outcomeSlotCount }, (_: undefined, i: number) => BigInt(1 << i));
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
