import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { HashZero } from "@ethersproject/constants";
import ConditionalTokensABI from "../abi/ConditionalTokens.json";
import { CallType, Transaction } from "../types";

const encodeRedeem = (
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: BigNumberish[],
): string =>
  new Interface(ConditionalTokensABI).encodeFunctionData("redeemPositions(address,bytes32,bytes32,uint256[])", [
    collateralTokenAddress,
    parentCollectionId,
    conditionId,
    partition,
  ]);

const redeemTransaction = (
  conditionalTokensAddress: string,
  collateralTokenAddress: string,
  parentCollectionId: string,
  conditionId: string,
  partition: BigNumberish[],
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
  // partition: BigNumberish[],
): Transaction[] => {
  // Assume that we're redeeming a condition which has been split from collateral
  const parentCollectionId = HashZero;
  // Assume that we're redeeming a full set of outcome tokens
  // eslint-disable-next-line no-bitwise
  const partition = Array.from({ length: outcomeSlotCount }, (_: undefined, i: number) => 1 << i);
  return [
    redeemTransaction(conditionalTokensAddress, collateralTokenAddress, parentCollectionId, conditionId, partition),
  ];
};
