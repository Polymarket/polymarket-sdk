import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import ERC20ABI from "../abi/ERC20.json";
import { CallType, Transaction } from "../types";

const encodeTokenApproval = (approvedAddress: string, approvalAmount: BigNumberish): string =>
  new Interface(ERC20ABI).encodeFunctionData("approve(address,uint256)", [approvedAddress, approvalAmount]);

export const erc20ApprovalTransaction = (tokenAddress: string, spender: string, amount: BigNumberish): Transaction => ({
  to: tokenAddress,
  typeCode: CallType.Call,
  data: encodeTokenApproval(spender, amount),
  value: "0",
});
