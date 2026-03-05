import { describe, expect, it } from "vitest";
import { decodeFunctionData, zeroHash } from "viem";
import { splitPosition, mergePositions, redeemPositions } from "../src/index.js";
import { CallType } from "../src/types.js";
import ConditionalTokensABI from "../src/abi/ConditionalTokens.json" with { type: "json" };

const CT_ADDRESS = "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045";
const COLLATERAL_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const CONDITION_ID = "0xabc123def456abc123def456abc123def456abc123def456abc123def456abc1";

describe("splitPosition", () => {
  it("returns a single transaction targeting the CT contract", () => {
    const txs = splitPosition(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 2, 100n);
    expect(txs).toHaveLength(1);
    expect(txs[0].to).toBe(CT_ADDRESS);
    expect(txs[0].typeCode).toBe(CallType.Call);
    expect(txs[0].value).toBe("0");
  });

  it("encodes splitPosition with outcomeSlotCount=2", () => {
    const txs = splitPosition(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 2, 100n);
    const decoded = decodeFunctionData({ abi: ConditionalTokensABI, data: txs[0].data as `0x${string}` });

    expect(decoded.functionName).toBe("splitPosition");
    const [collateral, parentCollection, conditionId, partition, amount] = decoded.args as [
      string,
      string,
      string,
      bigint[],
      bigint,
    ];
    expect(collateral).toBe(COLLATERAL_ADDRESS);
    expect(parentCollection).toBe(zeroHash);
    expect(conditionId).toBe(CONDITION_ID);
    expect(partition).toEqual([1n, 2n]);
    expect(amount).toBe(100n);
  });

  it("encodes splitPosition with outcomeSlotCount=3", () => {
    const txs = splitPosition(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 3, 500n);
    const decoded = decodeFunctionData({ abi: ConditionalTokensABI, data: txs[0].data as `0x${string}` });

    expect(decoded.functionName).toBe("splitPosition");
    const [, , , partition, amount] = decoded.args as [string, string, string, bigint[], bigint];
    expect(partition).toEqual([1n, 2n, 4n]);
    expect(amount).toBe(500n);
  });
});

describe("mergePositions", () => {
  it("returns a single transaction targeting the CT contract", () => {
    const txs = mergePositions(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 2, 200n);
    expect(txs).toHaveLength(1);
    expect(txs[0].to).toBe(CT_ADDRESS);
    expect(txs[0].typeCode).toBe(CallType.Call);
    expect(txs[0].value).toBe("0");
  });

  it("encodes mergePositions with outcomeSlotCount=2", () => {
    const txs = mergePositions(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 2, 200n);
    const decoded = decodeFunctionData({ abi: ConditionalTokensABI, data: txs[0].data as `0x${string}` });

    expect(decoded.functionName).toBe("mergePositions");
    const [collateral, parentCollection, conditionId, partition, amount] = decoded.args as [
      string,
      string,
      string,
      bigint[],
      bigint,
    ];
    expect(collateral).toBe(COLLATERAL_ADDRESS);
    expect(parentCollection).toBe(zeroHash);
    expect(conditionId).toBe(CONDITION_ID);
    expect(partition).toEqual([1n, 2n]);
    expect(amount).toBe(200n);
  });

  it("encodes mergePositions with outcomeSlotCount=4", () => {
    const txs = mergePositions(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 4, 1000n);
    const decoded = decodeFunctionData({ abi: ConditionalTokensABI, data: txs[0].data as `0x${string}` });

    expect(decoded.functionName).toBe("mergePositions");
    const [, , , partition, amount] = decoded.args as [string, string, string, bigint[], bigint];
    expect(partition).toEqual([1n, 2n, 4n, 8n]);
    expect(amount).toBe(1000n);
  });
});

describe("redeemPositions", () => {
  it("returns a single transaction targeting the CT contract", () => {
    const txs = redeemPositions(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 2);
    expect(txs).toHaveLength(1);
    expect(txs[0].to).toBe(CT_ADDRESS);
    expect(txs[0].typeCode).toBe(CallType.Call);
    expect(txs[0].value).toBe("0");
  });

  it("encodes redeemPositions with outcomeSlotCount=2", () => {
    const txs = redeemPositions(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 2);
    const decoded = decodeFunctionData({ abi: ConditionalTokensABI, data: txs[0].data as `0x${string}` });

    expect(decoded.functionName).toBe("redeemPositions");
    const [collateral, parentCollection, conditionId, partition] = decoded.args as [
      string,
      string,
      string,
      bigint[],
    ];
    expect(collateral).toBe(COLLATERAL_ADDRESS);
    expect(parentCollection).toBe(zeroHash);
    expect(conditionId).toBe(CONDITION_ID);
    expect(partition).toEqual([1n, 2n]);
  });

  it("encodes redeemPositions with outcomeSlotCount=3", () => {
    const txs = redeemPositions(CT_ADDRESS, COLLATERAL_ADDRESS, CONDITION_ID, 3);
    const decoded = decodeFunctionData({ abi: ConditionalTokensABI, data: txs[0].data as `0x${string}` });

    expect(decoded.functionName).toBe("redeemPositions");
    const [, , , partition] = decoded.args as [string, string, string, bigint[]];
    expect(partition).toEqual([1n, 2n, 4n]);
  });
});
