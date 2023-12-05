import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { CallType, Transaction } from "../types";
import NegRiskAdapterABI from "../abi/NegRiskAdapter.json";

type ConvertPositionsParams = {
  negRiskAdapterAddress: string;
  marketId: string;
  indexSet: BigNumberish;
  amount: BigNumberish;
};

type RedeemPositionsParams = {
  negRiskAdapterAddress: string;
  conditionId: string;
  amounts: [BigNumberish, BigNumberish];
};

const NegRiskAdapterInterface = new Interface(NegRiskAdapterABI);
const convertPositionsSignature = "convertPositions(bytes32,uint256,uint256)";
const redeemPositionsSignature = "redeemPositions(bytes32,uint256[])";

const convertPositions = ({
  negRiskAdapterAddress,
  marketId,
  indexSet,
  amount,
}: ConvertPositionsParams): Transaction => ({
  to: negRiskAdapterAddress,
  typeCode: CallType.Call,
  data: NegRiskAdapterInterface.encodeFunctionData(convertPositionsSignature, [marketId, indexSet, amount]),
  value: "0",
});

const redeemPositions = ({ negRiskAdapterAddress, conditionId, amounts }: RedeemPositionsParams): Transaction => ({
  to: negRiskAdapterAddress,
  typeCode: CallType.Call,
  data: NegRiskAdapterInterface.encodeFunctionData(redeemPositionsSignature, [conditionId, amounts]),
  value: "0",
});

const negRiskOperations = { convertPositions, redeemPositions };

export { negRiskOperations };
