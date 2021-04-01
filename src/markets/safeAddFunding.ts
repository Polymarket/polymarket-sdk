import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const encodeSafeAddFunding = (
  marketMakerAddress: string,
  investmentAmount: BigNumberish,
  distributionHint: BigNumberish[],
  positionId: BigNumberish,
  minRefund: BigNumberish,
  maxRefund: BigNumberish,
): string =>
  new Interface([
    "function addFunding(address,uint256,uint256[] memory,uint256,uint256,uint256)",
  ]).encodeFunctionData("addFunding(address,uint256,uint256[] memory,uint256,uint256,uint256)", [
    marketMakerAddress,
    investmentAmount,
    distributionHint,
    positionId,
    minRefund,
    maxRefund,
  ]);

const safeAddFundingTransaction = (
  slippageCheckerAddress: string,
  marketMakerAddress: string,
  investmentAmount: BigNumberish,
  distributionHint: BigNumberish[],
  positionId: BigNumberish,
  minRefund: BigNumberish,
  maxRefund: BigNumberish,
): Transaction => ({
  to: slippageCheckerAddress,
  typeCode: CallType.DelegateCall,
  data: encodeSafeAddFunding(marketMakerAddress, investmentAmount, distributionHint, positionId, minRefund, maxRefund),
  value: "0",
});

export const safeAddFundingToMarket = (
  slippageCheckerAddress: string,
  marketMakerAddress: string,
  collateralTokenAddress: string,
  investmentAmount: BigNumberish,
  distributionHint: BigNumberish[] = [],
  positionId: BigNumberish,
  minRefund: BigNumberish,
  maxRefund: BigNumberish,
): Transaction[] => [
  erc20ApprovalTransaction(collateralTokenAddress, marketMakerAddress, investmentAmount),
  safeAddFundingTransaction(
    slippageCheckerAddress,
    marketMakerAddress,
    investmentAmount,
    distributionHint,
    positionId,
    minRefund,
    maxRefund,
  ),
];
