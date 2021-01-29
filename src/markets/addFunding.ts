import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import FixedProductMarketMakerABI from "../abi/FixedProductMarketMaker.json";
import { erc20ApprovalTransaction } from "../utils";
import { CallType, Transaction } from "../types";

const encodeAddFunding = (investmentAmount: BigNumberish, distributionHint: BigNumberish[]): string =>
  new Interface(FixedProductMarketMakerABI).encodeFunctionData("addFunding(uint256,uint256[])", [
    investmentAmount,
    distributionHint,
  ]);

const addFundingTransaction = (
  marketMakerAddress: string,
  investmentAmount: BigNumberish,
  distributionHint: BigNumberish[],
): Transaction => ({
  to: marketMakerAddress,
  typeCode: CallType.Call,
  data: encodeAddFunding(investmentAmount, distributionHint),
  value: "0",
});

export const addFundingToMarket = (
  marketMakerAddress: string,
  collateralTokenAddress: string,
  investmentAmount: BigNumberish,
  distributionHint: BigNumberish[] = [],
): Transaction[] => [
  erc20ApprovalTransaction(collateralTokenAddress, marketMakerAddress, investmentAmount),
  addFundingTransaction(marketMakerAddress, investmentAmount, distributionHint),
];
