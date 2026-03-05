import { CallType, type Transaction } from "../types.js";

export const ethTransferTransaction = (recipient: string, amount: bigint): Transaction => ({
  to: recipient,
  typeCode: CallType.Call,
  data: "0x",
  value: amount.toString(),
});
