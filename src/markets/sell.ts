import { encodeFunctionData } from "viem";
import FixedProductMarketMakerABI from "../abi/FixedProductMarketMaker.json";
import { erc1155ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const encodeSell = (
  returnAmount: bigint,
  outcomeIndex: bigint,
  maxOutcomeTokensToSell: bigint,
): string =>
  encodeFunctionData({
    abi: FixedProductMarketMakerABI,
    functionName: "sell",
    args: [returnAmount, outcomeIndex, maxOutcomeTokensToSell],
  });

const sellTransaction = (
  marketMakerAddress: string,
  returnAmount: bigint,
  outcomeIndex: bigint,
  maxOutcomeTokensToSell: bigint,
): Transaction => ({
  to: marketMakerAddress,
  typeCode: CallType.Call,
  data: encodeSell(returnAmount, outcomeIndex, maxOutcomeTokensToSell),
  value: "0",
});

export const sellMarketOutcome = (
  marketMakerAddress: string,
  conditionalTokensAddress: string,
  returnAmount: bigint,
  outcomeIndex: bigint,
  maxOutcomeTokensToSell: bigint,
): Transaction[] => [
  erc1155ApprovalTransaction(conditionalTokensAddress, marketMakerAddress, true),
  sellTransaction(marketMakerAddress, returnAmount, outcomeIndex, maxOutcomeTokensToSell),
  erc1155ApprovalTransaction(conditionalTokensAddress, marketMakerAddress, false),
];
