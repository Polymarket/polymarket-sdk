import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import { CallType, Transaction } from "../types";

const encodeWithdraw = (withdrawAmount: BigNumberish): string =>
  new Interface(["function withdraw(uint256)"]).encodeFunctionData("withdraw(uint256)", [withdrawAmount]);

const withdrawTransaction = (tokenAddress: string, withdrawAmount: BigNumberish): Transaction => ({
  to: tokenAddress,
  typeCode: CallType.Call,
  data: encodeWithdraw(withdrawAmount),
  value: "0",
});

export const withdrawFundsOnMatic = (tokenAddress: string, withdrawAmount: BigNumberish): Transaction[] => [
  withdrawTransaction(tokenAddress, withdrawAmount),
];
