import { Interface } from "@ethersproject/abi";
import { BigNumber } from "@ethersproject/bignumber";
import { Transaction, CallType } from "../types";
import { erc20ApprovalTransaction } from "../utils";

const encodePayDebt = (amount: BigNumber): string =>
  new Interface(["function payDebt(uint256)"]).encodeFunctionData("payDebt(uint256)", [amount]);

const payDebtTransaction = (debtTracker: string, amount: BigNumber): Transaction => ({
  to: debtTracker,
  typeCode: CallType.Call,
  data: encodePayDebt(amount),
  value: "0",
});

export const payDebt = (debtTracker: string, tokenAddress: string, amount: BigNumber): Transaction[] => [
  erc20ApprovalTransaction(tokenAddress, debtTracker, amount),
  payDebtTransaction(debtTracker, amount),
];
