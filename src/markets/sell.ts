import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import FixedProductMarketMakerABI from "../abi/FixedProductMarketMaker.json";
import { erc1155ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const encodeSell = (
  returnAmount: BigNumberish,
  outcomeIndex: BigNumberish,
  maxOutcomeTokensToSell: BigNumberish,
): string =>
  new Interface(FixedProductMarketMakerABI).encodeFunctionData("sell(uint256,uint256,uint256)", [
    returnAmount,
    outcomeIndex,
    maxOutcomeTokensToSell,
  ]);

const sellTransaction = (
  marketMakerAddress: string,
  returnAmount: BigNumberish,
  outcomeIndex: BigNumberish,
  maxOutcomeTokensToSell: BigNumberish,
): Transaction => ({
  to: marketMakerAddress,
  typeCode: CallType.Call,
  data: encodeSell(returnAmount, outcomeIndex, maxOutcomeTokensToSell),
  value: "0",
});

export const sellMarketOutcome = (
  marketMakerAddress: string,
  conditionalTokensAddress: string,
  returnAmount: BigNumberish,
  outcomeIndex: BigNumberish,
  maxOutcomeTokensToSell: BigNumberish,
): Transaction[] => [
  erc1155ApprovalTransaction(conditionalTokensAddress, marketMakerAddress, true),
  sellTransaction(marketMakerAddress, returnAmount, outcomeIndex, maxOutcomeTokensToSell),
  erc1155ApprovalTransaction(conditionalTokensAddress, marketMakerAddress, false),
];
