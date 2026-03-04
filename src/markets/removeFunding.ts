import { encodeFunctionData } from "viem";
import FixedProductMarketMakerABI from "../abi/FixedProductMarketMaker.json";
import { CallType, Transaction } from "../types";

const encodeRemoveFunding = (sharesToBurn: bigint): string =>
  encodeFunctionData({ abi: FixedProductMarketMakerABI, functionName: "removeFunding", args: [sharesToBurn] });

const removeFundingTransaction = (marketMakerAddress: string, sharesToBurn: bigint): Transaction => ({
  to: marketMakerAddress,
  typeCode: CallType.Call,
  data: encodeRemoveFunding(sharesToBurn),
  value: "0",
});

export const removeFundingFromMarket = (marketMakerAddress: string, sharesToBurn: bigint): Transaction[] => [
  removeFundingTransaction(marketMakerAddress, sharesToBurn),
];
