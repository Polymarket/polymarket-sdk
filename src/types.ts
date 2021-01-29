export enum CallType {
  Invalid = "0",
  Call = "1",
  DelegateCall = "2",
}

export interface Transaction {
  to: string;
  typeCode: CallType;
  data: string;
  value: string;
}
