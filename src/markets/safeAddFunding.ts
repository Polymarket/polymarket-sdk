import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const encodeSafeAddFunding = (
  marketMakerAddress: string,
  investmentAmount: BigNumberish,
  distributionHint: BigNumberish[],
  positionIds: BigNumberish[],
  minRefunds: BigNumberish[],
  maxRefunds: BigNumberish[],
): string =>
  new Interface([
    "function addFunding(address,uint256,uint256[] memory,uint256[] memory,uint256[] memory,uint256[] memory)",
  ]).encodeFunctionData(
    "addFunding(address,uint256,uint256[] memory,uint256[] memory,uint256[] memory,uint256[] memory)",
    [marketMakerAddress, investmentAmount, distributionHint, positionIds, minRefunds, maxRefunds],
  );

const safeAddFundingTransaction = (
  slippageCheckerAddress: string,
  marketMakerAddress: string,
  investmentAmount: BigNumberish,
  distributionHint: BigNumberish[],
  positionIds: BigNumberish[],
  minRefunds: BigNumberish[],
  maxRefunds: BigNumberish[],
): Transaction => ({
  to: slippageCheckerAddress,
  typeCode: CallType.DelegateCall,
  data: encodeSafeAddFunding(
    marketMakerAddress,
    investmentAmount,
    distributionHint,
    positionIds,
    minRefunds,
    maxRefunds,
  ),
  value: "0",
});

export const safeAddFundingToMarket = (
  slippageCheckerAddress: string,
  marketMakerAddress: string,
  collateralTokenAddress: string,
  investmentAmount: BigNumberish,
  distributionHint: BigNumberish[] = [],
  positionIds: BigNumberish[],
  minRefunds: BigNumberish[],
  maxRefunds: BigNumberish[],
): Transaction[] => [
  erc20ApprovalTransaction(collateralTokenAddress, marketMakerAddress, investmentAmount),
  safeAddFundingTransaction(
    slippageCheckerAddress,
    marketMakerAddress,
    investmentAmount,
    distributionHint,
    positionIds,
    minRefunds,
    maxRefunds,
  ),
];
