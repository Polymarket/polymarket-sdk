import { encodeFunctionData } from "viem";
import ERC20ABI from "../abi/ERC20.json";
import { CallType, Transaction } from "../types";

const encodeTokenApproval = (approvedAddress: string, approvalAmount: bigint): string =>
  encodeFunctionData({ abi: ERC20ABI, functionName: "approve", args: [approvedAddress, approvalAmount] });

export const erc20ApprovalTransaction = (tokenAddress: string, spender: string, amount: bigint): Transaction => ({
  to: tokenAddress,
  typeCode: CallType.Call,
  data: encodeTokenApproval(spender, amount),
  value: "0",
});
