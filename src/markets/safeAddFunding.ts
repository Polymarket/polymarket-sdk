import { encodeFunctionData, parseAbi, type Address } from "viem";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const safeAddFundingAbi = parseAbi([
  "function addFunding(address,uint256,uint256[],uint256[],uint256[],uint256[])",
]);

const encodeSafeAddFunding = (
  marketMakerAddress: string,
  investmentAmount: bigint,
  distributionHint: bigint[],
  positionIds: bigint[],
  minRefunds: bigint[],
  maxRefunds: bigint[],
): string =>
  encodeFunctionData({
    abi: safeAddFundingAbi,
    functionName: "addFunding",
    args: [marketMakerAddress as Address, investmentAmount, distributionHint, positionIds, minRefunds, maxRefunds],
  });

const safeAddFundingTransaction = (
  slippageCheckerAddress: string,
  marketMakerAddress: string,
  investmentAmount: bigint,
  distributionHint: bigint[],
  positionIds: bigint[],
  minRefunds: bigint[],
  maxRefunds: bigint[],
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
  investmentAmount: bigint,
  distributionHint: bigint[] = [],
  positionIds: bigint[],
  minRefunds: bigint[],
  maxRefunds: bigint[],
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
