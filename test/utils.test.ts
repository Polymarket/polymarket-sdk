import { describe, expect, it } from "vitest";
import { decodeFunctionData } from "viem";
import { erc20TransferTransaction } from "../src/index.js";
import { erc20ApprovalTransaction } from "../src/utils/approveErc20.js";
import { erc1155ApprovalTransaction } from "../src/utils/approveErc1155.js";
import { CallType } from "../src/types.js";
import ERC20ABI from "../src/abi/ERC20.json" with { type: "json" };
import ERC1155ABI from "../src/abi/ERC1155.json" with { type: "json" };

const TOKEN_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const SPENDER = "0x4D97DCd97eC945f40cF65F87097ACe5EA0476045";
const RECIPIENT = "0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296";

describe("erc20ApprovalTransaction", () => {
  it("returns a transaction targeting the token address", () => {
    const tx = erc20ApprovalTransaction(TOKEN_ADDRESS, SPENDER, 1000n);
    expect(tx.to).toBe(TOKEN_ADDRESS);
    expect(tx.typeCode).toBe(CallType.Call);
    expect(tx.value).toBe("0");
  });

  it("encodes approve with the correct spender and amount", () => {
    const tx = erc20ApprovalTransaction(TOKEN_ADDRESS, SPENDER, 5000n);
    const decoded = decodeFunctionData({ abi: ERC20ABI, data: tx.data as `0x${string}` });

    expect(decoded.functionName).toBe("approve");
    const [spender, amount] = decoded.args as [string, bigint];
    expect(spender).toBe(SPENDER);
    expect(amount).toBe(5000n);
  });
});

describe("erc1155ApprovalTransaction", () => {
  it("returns a transaction targeting the token address", () => {
    const tx = erc1155ApprovalTransaction(TOKEN_ADDRESS, SPENDER, true);
    expect(tx.to).toBe(TOKEN_ADDRESS);
    expect(tx.typeCode).toBe(CallType.Call);
    expect(tx.value).toBe("0");
  });

  it("encodes setApprovalForAll with approval=true", () => {
    const tx = erc1155ApprovalTransaction(TOKEN_ADDRESS, SPENDER, true);
    const decoded = decodeFunctionData({ abi: ERC1155ABI, data: tx.data as `0x${string}` });

    expect(decoded.functionName).toBe("setApprovalForAll");
    const [spender, approval] = decoded.args as [string, boolean];
    expect(spender).toBe(SPENDER);
    expect(approval).toBe(true);
  });

  it("encodes setApprovalForAll with approval=false", () => {
    const tx = erc1155ApprovalTransaction(TOKEN_ADDRESS, SPENDER, false);
    const decoded = decodeFunctionData({ abi: ERC1155ABI, data: tx.data as `0x${string}` });

    expect(decoded.functionName).toBe("setApprovalForAll");
    const [, approval] = decoded.args as [string, boolean];
    expect(approval).toBe(false);
  });
});

describe("erc20TransferTransaction", () => {
  it("returns a transaction targeting the token address", () => {
    const tx = erc20TransferTransaction(TOKEN_ADDRESS, RECIPIENT, 300n);
    expect(tx.to).toBe(TOKEN_ADDRESS);
    expect(tx.typeCode).toBe(CallType.Call);
    expect(tx.value).toBe("0");
  });

  it("encodes transfer with the correct recipient and amount", () => {
    const tx = erc20TransferTransaction(TOKEN_ADDRESS, RECIPIENT, 9999n);
    const decoded = decodeFunctionData({ abi: ERC20ABI, data: tx.data as `0x${string}` });

    expect(decoded.functionName).toBe("transfer");
    const [recipient, amount] = decoded.args as [string, bigint];
    expect(recipient).toBe(RECIPIENT);
    expect(amount).toBe(9999n);
  });
});
