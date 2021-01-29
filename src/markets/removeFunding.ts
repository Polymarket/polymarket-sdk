import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import FixedProductMarketMakerABI from "../abi/FixedProductMarketMaker.json";
import { CallType, Transaction } from "../types";

const encodeRemoveFunding = (sharesToBurn: BigNumberish): string =>
  new Interface(FixedProductMarketMakerABI).encodeFunctionData("removeFunding(uint256)", [sharesToBurn]);

const removeFundingTransaction = (marketMakerAddress: string, sharesToBurn: BigNumberish): Transaction => ({
  to: marketMakerAddress,
  typeCode: CallType.Call,
  data: encodeRemoveFunding(sharesToBurn),
  value: "0",
});

export const removeFundingFromMarket = (marketMakerAddress: string, sharesToBurn: BigNumberish): Transaction[] => [
  removeFundingTransaction(marketMakerAddress, sharesToBurn),
];
