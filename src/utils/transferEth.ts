import { BigNumberish } from "@ethersproject/bignumber";
import { CallType, Transaction } from "../types";

export const ethTransferTransaction = (recipient: string, amount: BigNumberish): Transaction => ({
  to: recipient,
  typeCode: CallType.Call,
  data: "0x",
  value: amount.toString(),
});
