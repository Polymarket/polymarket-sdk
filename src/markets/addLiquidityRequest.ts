import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { CallType, Transaction } from "../types";
import LiquidityRequestLogABI from "../abi/LiquidityRequestLog.json";

const encodeAddLiquidityRequest = (reason: string, marketMakerAddress: string, tradeAmount: BigNumber): string =>
  new Interface(LiquidityRequestLogABI).encodeFunctionData("addLiquidityRequest(string,address,uint256)", [
    reason,
    marketMakerAddress,
    tradeAmount,
  ]);

const addLiquidityRequestTransaction = (
  liquidityRequestLog: string,
  reason: string,
  marketMakerAddress: string,
  tradeAmount: BigNumber,
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
  tradeAmount: BigNumber,
): Transaction[] => [addLiquidityRequestTransaction(liquidityRequestLog, reason, marketMakerAddress, tradeAmount)];
