import { encodeFunctionData } from "viem";
import { CallType, Transaction } from "../types";
import NegRiskAdapterABI from "../abi/NegRiskAdapter.json";

type ConvertPositionsParams = {
  negRiskAdapterAddress: string;
  marketId: string;
  indexSet: bigint;
  amount: bigint;
};

type RedeemPositionsParams = {
  negRiskAdapterAddress: string;
  conditionId: string;
  amounts: [bigint, bigint];
};

const convertPositions = ({
  negRiskAdapterAddress,
  marketId,
  indexSet,
  amount,
}: ConvertPositionsParams): Transaction => ({
  to: negRiskAdapterAddress,
  typeCode: CallType.Call,
  data: encodeFunctionData({
    abi: NegRiskAdapterABI,
    functionName: "convertPositions",
    args: [marketId, indexSet, amount],
  }),
  value: "0",
});

const redeemPositions = ({ negRiskAdapterAddress, conditionId, amounts }: RedeemPositionsParams): Transaction => ({
  to: negRiskAdapterAddress,
  typeCode: CallType.Call,
  data: encodeFunctionData({
    abi: NegRiskAdapterABI,
    functionName: "redeemPositions",
    args: [conditionId, amounts],
  }),
  value: "0",
});

const negRiskOperations = { convertPositions, redeemPositions };

export { negRiskOperations };
