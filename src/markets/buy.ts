import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import FixedProductMarketMakerABI from "../abi/FixedProductMarketMaker.json";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const encodeBuy = (
  investmentAmount: BigNumberish,
  outcomeIndex: BigNumberish,
  minOutcomeTokensToBuy: BigNumberish,
): string =>
  new Interface(FixedProductMarketMakerABI).encodeFunctionData("buy(uint256,uint256,uint256)", [
    investmentAmount,
    outcomeIndex,
    minOutcomeTokensToBuy,
  ]);

const buyTransaction = (
  marketMakerAddress: string,
  investmentAmount: BigNumberish,
  outcomeIndex: BigNumberish,
  minOutcomeTokensToBuy: BigNumberish,
): Transaction => ({
  to: marketMakerAddress,
  typeCode: CallType.Call,
  data: encodeBuy(investmentAmount, outcomeIndex, minOutcomeTokensToBuy),
  value: "0",
});

export const buyMarketOutcome = (
  marketMakerAddress: string,
  collateralTokenAddress: string,
  investmentAmount: BigNumberish,
  outcomeIndex: BigNumberish,
  minOutcomeTokensToBuy: BigNumberish,
): Transaction[] => [
  erc20ApprovalTransaction(collateralTokenAddress, marketMakerAddress, investmentAmount),
  buyTransaction(marketMakerAddress, investmentAmount, outcomeIndex, minOutcomeTokensToBuy),
];
