export interface CreateTOTP {
    id: Number ;
    name: string;
    secretKey: string | undefined;
    url: string;
    email: string;
    password: string;
  }
  