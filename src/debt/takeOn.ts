import { encodeFunctionData, parseAbi, type Hex } from "viem";
import { CallType, Transaction } from "../types";

const takeOnDebtAbi = parseAbi(["function takeOnDebt(uint256,bytes32)"]);

const encodeTakeOnDebt = (amount: bigint, txHash: Hex): string =>
  encodeFunctionData({ abi: takeOnDebtAbi, functionName: "takeOnDebt", args: [amount, txHash] });

const takeOnDebtTransaction = (debtTracker: string, amount: bigint, txHash: Hex): Transaction => ({
  to: debtTracker,
  typeCode: CallType.Call,
  data: encodeTakeOnDebt(amount, txHash),
  value: "0",
});

export const takeOnDebt = (debtTracker: string, amount: bigint, txHash: Hex): Transaction[] => [
  takeOnDebtTransaction(debtTracker, amount, txHash),
];
