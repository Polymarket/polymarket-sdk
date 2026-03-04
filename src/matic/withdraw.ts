import { encodeFunctionData, parseAbi } from "viem";
import { CallType, Transaction } from "../types";

const withdrawAbi = parseAbi(["function withdraw(uint256)"]);

const encodeWithdraw = (withdrawAmount: bigint): string =>
  encodeFunctionData({ abi: withdrawAbi, functionName: "withdraw", args: [withdrawAmount] });

const withdrawTransaction = (tokenAddress: string, withdrawAmount: bigint): Transaction => ({
  to: tokenAddress,
  typeCode: CallType.Call,
  data: encodeWithdraw(withdrawAmount),
  value: "0",
});

export const withdrawFundsOnMatic = (tokenAddress: string, withdrawAmount: bigint): Transaction[] => [
  withdrawTransaction(tokenAddress, withdrawAmount),
];
