import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { CallType, Transaction } from "../types";
import AdapterAbi from "../abi/UmaCtfAdapter.json";
import NegRiskAdapterAbi from "../abi/NegRiskUmaCtfAdapter.json";

const AdapterInterface = new Interface(AdapterAbi);
const NegRiskAdapterInterface = new Interface(NegRiskAdapterAbi);

const initializeSig = "initialize(bytes,address,uint256,uint256)";
const negRiskInitializeSig = "initialize(bytes,address,uint256,uint256,uint256)";

const encodeInitialize = (
  ancillaryData: Uint8Array,
  rewardToken: string,
  reward: BigNumberish,
  proposalBond: BigNumberish,
): string => {
  return AdapterInterface.encodeFunctionData(initializeSig, [ancillaryData, rewardToken, reward, proposalBond]);
};

const encodeNegRiskInitialize = (
  ancillaryData: Uint8Array,
  rewardToken: string,
  reward: BigNumberish,
  proposalBond: BigNumberish,
  liveness: BigNumberish,
): string => {
  return NegRiskAdapterInterface.encodeFunctionData(negRiskInitializeSig, [
    ancillaryData,
    rewardToken,
    reward,
    proposalBond,
    liveness,
  ]);
};

export const initialize = (
  adapterAddress: string,
  ancillaryData: Uint8Array,
  rewardToken: string,
  reward: BigNumberish,
  proposalBond: BigNumberish,
): Transaction => {
  return {
    to: adapterAddress,
    typeCode: CallType.Call,
    data: encodeInitialize(ancillaryData, rewardToken, reward, proposalBond),
    value: "0",
  };
};

export const negRiskInitialize = (
  adapterAddress: string,
  ancillaryData: Uint8Array,
  rewardToken: string,
  reward: BigNumberish,
  proposalBond: BigNumberish,
  liveness: BigNumberish,
): Transaction => {
  return {
    to: adapterAddress,
    typeCode: CallType.Call,
    data: encodeNegRiskInitialize(ancillaryData, rewardToken, reward, proposalBond, liveness),
    value: "0",
  };
};
