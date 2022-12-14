import { DelegationModel } from './delegation-model';

export interface CreateTOTP {
  id: Number | undefined;
  name: string;
  secretKey: string | undefined;
  url: string;
  email: string;
  password: string;
  delegationTableModel: DelegationModel[] | undefined;
}
