import { encodeFunctionData } from "viem";
import { CallType, Transaction } from "../types.js";
import LiquidityRequestLogABI from "../abi/LiquidityRequestLog.json" with { type: "json" };

const encodeAddLiquidityRequest = (reason: string, marketMakerAddress: string, tradeAmount: bigint): string =>
  encodeFunctionData({
    abi: LiquidityRequestLogABI,
    functionName: "addLiquidityRequest",
    args: [reason, marketMakerAddress, tradeAmount],
  });

const addLiquidityRequestTransaction = (
  liquidityRequestLog: string,
  reason: string,
  marketMakerAddress: string,
  tradeAmount: bigint,
): Transaction => ({
  to: liquidityRequestLog,
  typeCode: CallType.Call,
  data: encodeAddLiquidityRequest(reason, marketMakerAddress, tradeAmount),
  value: "0",
});

export const addLiquidityRequest = (
  liquidityRequestLog: string,
  reason: string,
  marketMakerAddress: string,
  tradeAmount: bigint,
): Transaction[] => [addLiquidityRequestTransaction(liquidityRequestLog, reason, marketMakerAddress, tradeAmount)];
