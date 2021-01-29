import { Interface } from "@ethersproject/abi";
import { BigNumberish } from "@ethersproject/bignumber";
import ERC20ABI from "../abi/ERC20.json";
import { CallType, Transaction } from "../types";

const encodeTokenTransfer = (recipientAddress: string, amount: BigNumberish): string =>
  new Interface(ERC20ABI).encodeFunctionData("transfer(address,uint256)", [recipientAddress, amount]);

export const erc20TransferTransaction = (
  tokenAddress: string,
  recipient: string,
  amount: BigNumberish,
): Transaction => ({
  to: tokenAddress,
  typeCode: CallType.Call,
  data: encodeTokenTransfer(recipient, amount),
  value: "0",
});
