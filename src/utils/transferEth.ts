import { CallType, Transaction } from "../types";

export const ethTransferTransaction = (recipient: string, amount: bigint): Transaction => ({
  to: recipient,
  typeCode: CallType.Call,
  data: "0x",
  value: amount.toString(),
});
