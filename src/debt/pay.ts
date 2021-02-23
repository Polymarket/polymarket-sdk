import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { Transaction, CallType } from "../types";

const encodePayDebt = (amount: BigNumber): string =>
  new Interface(["function payDebt(uint256)"]).encodeFunctionData("payDebt(uint256)", [amount]);

const payDebtTransaction = (debtTracker: string, amount: BigNumber): Transaction => ({
  to: debtTracker,
  typeCode: CallType.Call,
  data: encodePayDebt(amount),
  value: "0",
});

export const payDebt = (debtTracker: string, amount: BigNumber): Transaction[] => [
  payDebtTransaction(debtTracker, amount),
];
