import { DelegationModel } from "./delegation-model";


export interface TotpResponse {
  id: Number;
  name: string;
  // type: typeList;
  type:string;
  secret: string;
  url: string;
  email: string;
  password: string;
  owner: boolean;
  delegationTable: DelegationModel[];
  writeUser: boolean;
 
}
