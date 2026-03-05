import { describe, expect, it } from "vitest";
import { decodeFunctionData } from "viem";
import { negRiskOperations } from "../src/index.js";
import { CallType } from "../src/types.js";
import NegRiskAdapterABI from "../src/abi/NegRiskAdapter.json" with { type: "json" };

const NEG_RISK_ADAPTER = "0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296";
const MARKET_ID = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
const CONDITION_ID = "0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1";

describe("negRiskOperations.convertPositions", () => {
  it("returns a transaction targeting the neg risk adapter", () => {
    const tx = negRiskOperations.convertPositions({
      negRiskAdapterAddress: NEG_RISK_ADAPTER,
      marketId: MARKET_ID,
      indexSet: 3n,
      amount: 1000n,
    });

    expect(tx.to).toBe(NEG_RISK_ADAPTER);
    expect(tx.typeCode).toBe(CallType.Call);
    expect(tx.value).toBe("0");
  });

  it("encodes convertPositions with the correct args", () => {
    const tx = negRiskOperations.convertPositions({
      negRiskAdapterAddress: NEG_RISK_ADAPTER,
      marketId: MARKET_ID,
      indexSet: 5n,
      amount: 2000n,
    });

    const decoded = decodeFunctionData({ abi: NegRiskAdapterABI, data: tx.data as `0x${string}` });
    expect(decoded.functionName).toBe("convertPositions");

    const [marketId, indexSet, amount] = decoded.args as [string, bigint, bigint];
    expect(marketId).toBe(MARKET_ID);
    expect(indexSet).toBe(5n);
    expect(amount).toBe(2000n);
  });
});

describe("negRiskOperations.redeemPositions", () => {
  it("returns a transaction targeting the neg risk adapter", () => {
    const tx = negRiskOperations.redeemPositions({
      negRiskAdapterAddress: NEG_RISK_ADAPTER,
      conditionId: CONDITION_ID,
      amounts: [500n, 300n],
    });

    expect(tx.to).toBe(NEG_RISK_ADAPTER);
    expect(tx.typeCode).toBe(CallType.Call);
    expect(tx.value).toBe("0");
  });

  it("encodes redeemPositions with the correct args", () => {
    const tx = negRiskOperations.redeemPositions({
      negRiskAdapterAddress: NEG_RISK_ADAPTER,
      conditionId: CONDITION_ID,
      amounts: [750n, 250n],
    });

    const decoded = decodeFunctionData({ abi: NegRiskAdapterABI, data: tx.data as `0x${string}` });
    expect(decoded.functionName).toBe("redeemPositions");

    const [conditionId, amounts] = decoded.args as [string, [bigint, bigint]];
    expect(conditionId).toBe(CONDITION_ID);
    expect(amounts).toEqual([750n, 250n]);
  });
});
