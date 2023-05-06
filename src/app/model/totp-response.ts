import { DelegationModel } from "./delegation-model";


export interface TotpResponse {
  id: Number;
  name: string;
  type:string;
  secret: string;
  url: string;
  email: string;
  password: string;
  deleted:boolean;
  deletedBy:String;
  deletedAt:String;
  owner: boolean;
  delegationTable: DelegationModel[];
  writeUser: boolean;
 
}
