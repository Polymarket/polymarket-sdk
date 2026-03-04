import { encodeFunctionData } from "viem";
import ERC20ABI from "../abi/ERC20.json";
import { CallType, Transaction } from "../types";

const encodeTokenTransfer = (recipientAddress: string, amount: bigint): string =>
  encodeFunctionData({ abi: ERC20ABI, functionName: "transfer", args: [recipientAddress, amount] });

export const erc20TransferTransaction = (
  tokenAddress: string,
  recipient: string,
  amount: bigint,
): Transaction => ({
  to: tokenAddress,
  typeCode: CallType.Call,
  data: encodeTokenTransfer(recipient, amount),
  value: "0",
});
