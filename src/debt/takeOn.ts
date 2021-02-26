import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { CallType, Transaction } from "../types";

const encodeTakeOnDebt = (amount: BigNumber, txHash: string): string =>
  new Interface(["function takeOnDebt(uint256,bytes32)"]).encodeFunctionData("takeOnDebt(uint256,bytes32)", [
    amount,
    txHash,
  ]);

const takeOnDebtTransaction = (debtTracker: string, amount: BigNumber, txHash: string): Transaction => ({
  to: debtTracker,
  typeCode: CallType.Call,
  data: encodeTakeOnDebt(amount, txHash),
  value: "0",
});

export const takeOnDebt = (debtTracker: string, amount: BigNumber, txHash: string): Transaction[] => [
  takeOnDebtTransaction(debtTracker, amount, txHash),
];
