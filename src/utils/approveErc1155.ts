import { Interface } from "@ethersproject/abi";
import ERC1155ABI from "../abi/ERC1155.json";
import { CallType, Transaction } from "../types";

const encodeTokenApproval = (approvedAddress: string, approval: boolean): string =>
  new Interface(ERC1155ABI).encodeFunctionData("setApprovalForAll(address,bool)", [approvedAddress, approval]);

export const erc1155ApprovalTransaction = (tokenAddress: string, spender: string, approval: boolean): Transaction => ({
  to: tokenAddress,
  typeCode: CallType.Call,
  data: encodeTokenApproval(spender, approval),
  value: "0",
});
