import { encodeFunctionData } from "viem";
import { CallType, Transaction } from "../types.js";
import AdapterAbi from "../abi/UmaCtfAdapter.json" with { type: "json" };
import NegRiskAdapterAbi from "../abi/NegRiskUmaCtfAdapter.json" with { type: "json" };

const encodeInitialize = (
  ancillaryData: Uint8Array,
  rewardToken: string,
  reward: bigint,
  proposalBond: bigint,
): string => {
  return encodeFunctionData({
    abi: AdapterAbi,
    functionName: "initialize",
    args: [ancillaryData, rewardToken, reward, proposalBond],
  });
};

const encodeNegRiskInitialize = (
  ancillaryData: Uint8Array,
  rewardToken: string,
  reward: bigint,
  proposalBond: bigint,
  liveness: bigint,
): string => {
  return encodeFunctionData({
    abi: NegRiskAdapterAbi,
    functionName: "initialize",
    args: [ancillaryData, rewardToken, reward, proposalBond, liveness],
  });
};

export const initialize = (
  adapterAddress: string,
  ancillaryData: Uint8Array,
  rewardToken: string,
  reward: bigint,
  proposalBond: bigint,
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
  reward: bigint,
  proposalBond: bigint,
  liveness: bigint,
): Transaction => {
  return {
    to: adapterAddress,
    typeCode: CallType.Call,
    data: encodeNegRiskInitialize(ancillaryData, rewardToken, reward, proposalBond, liveness),
    value: "0",
  };
};
