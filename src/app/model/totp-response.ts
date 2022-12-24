export interface TotpResponse {
  id: Number;
  name: string;
  secret: string;
  url: string;
  email: string;
  password: string;
  isOwner: boolean;
}
