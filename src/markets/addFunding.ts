import { encodeFunctionData } from "viem";
import FixedProductMarketMakerABI from "../abi/FixedProductMarketMaker.json" with { type: "json" };
import { CallType, type Transaction } from "../types.js";
import { erc20ApprovalTransaction } from "../utils/index.js";

const encodeAddFunding = (investmentAmount: bigint, distributionHint: bigint[]): string =>
  encodeFunctionData({
    abi: FixedProductMarketMakerABI,
    functionName: "addFunding",
    args: [investmentAmount, distributionHint],
  });

const addFundingTransaction = (
  marketMakerAddress: string,
  investmentAmount: bigint,
  distributionHint: bigint[],
): Transaction => ({
  to: marketMakerAddress,
  typeCode: CallType.Call,
  data: encodeAddFunding(investmentAmount, distributionHint),
  value: "0",
});

export const addFundingToMarket = (
  marketMakerAddress: string,
  collateralTokenAddress: string,
  investmentAmount: bigint,
  distributionHint: bigint[] = [],
): Transaction[] => [
  erc20ApprovalTransaction(collateralTokenAddress, marketMakerAddress, investmentAmount),
  addFundingTransaction(marketMakerAddress, investmentAmount, distributionHint),
];
