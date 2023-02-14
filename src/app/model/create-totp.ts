import { DelegationModel } from './delegation-model';
import { typeList } from './NewType';

export interface CreateTOTP {
  id: Number | undefined;
  name: string;
  type:typeList;
  secretKey: string | undefined;
  url: string;
  email: string;
  password: string;
  delegationTableModel: DelegationModel[] | undefined;
}
