import { encodeFunctionData } from "viem";
import ERC1155ABI from "../abi/ERC1155.json" with { type: "json" };
import { CallType, Transaction } from "../types.js";

const encodeTokenApproval = (approvedAddress: string, approval: boolean): string =>
  encodeFunctionData({ abi: ERC1155ABI, functionName: "setApprovalForAll", args: [approvedAddress, approval] });

export const erc1155ApprovalTransaction = (tokenAddress: string, spender: string, approval: boolean): Transaction => ({
  to: tokenAddress,
  typeCode: CallType.Call,
  data: encodeTokenApproval(spender, approval),
  value: "0",
});
