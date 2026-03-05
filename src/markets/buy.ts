import { encodeFunctionData } from "viem";
import FixedProductMarketMakerABI from "../abi/FixedProductMarketMaker.json";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const encodeBuy = (
  investmentAmount: bigint,
  outcomeIndex: bigint,
  minOutcomeTokensToBuy: bigint,
): string =>
  encodeFunctionData({
    abi: FixedProductMarketMakerABI,
    functionName: "buy",
    args: [investmentAmount, outcomeIndex, minOutcomeTokensToBuy],
  });

const buyTransaction = (
  marketMakerAddress: string,
  investmentAmount: bigint,
  outcomeIndex: bigint,
  minOutcomeTokensToBuy: bigint,
): Transaction => ({
  to: marketMakerAddress,
  typeCode: CallType.Call,
  data: encodeBuy(investmentAmount, outcomeIndex, minOutcomeTokensToBuy),
  value: "0",
});

export const buyMarketOutcome = (
  marketMakerAddress: string,
  collateralTokenAddress: string,
  investmentAmount: bigint,
  outcomeIndex: bigint,
  minOutcomeTokensToBuy: bigint,
): Transaction[] => [
  erc20ApprovalTransaction(collateralTokenAddress, marketMakerAddress, investmentAmount),
  buyTransaction(marketMakerAddress, investmentAmount, outcomeIndex, minOutcomeTokensToBuy),
];
