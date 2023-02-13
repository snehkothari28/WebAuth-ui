import { DelegationModel } from "./delegation-model";
// import { typeList } from "./NewType";

export interface TotpResponse {
  id: Number;
  name: string;
  type: string;
  // type: typeList;
  secret: string;
  url: string;
  email: string;
  password: string;
  owner: boolean;
  delegationTable: DelegationModel[];
  writeUser: boolean;
 
}
