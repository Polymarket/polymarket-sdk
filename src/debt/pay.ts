import { encodeFunctionData, parseAbi } from "viem";
import { Transaction, CallType } from "../types.js";
import { erc20ApprovalTransaction } from "../utils/index.js";

const payDebtAbi = parseAbi(["function payDebt(uint256)"]);

const encodePayDebt = (amount: bigint): string =>
  encodeFunctionData({ abi: payDebtAbi, functionName: "payDebt", args: [amount] });

const payDebtTransaction = (debtTracker: string, amount: bigint): Transaction => ({
  to: debtTracker,
  typeCode: CallType.Call,
  data: encodePayDebt(amount),
  value: "0",
});

export const payDebt = (debtTracker: string, tokenAddress: string, amount: bigint): Transaction[] => [
  erc20ApprovalTransaction(tokenAddress, debtTracker, amount),
  payDebtTransaction(debtTracker, amount),
];
