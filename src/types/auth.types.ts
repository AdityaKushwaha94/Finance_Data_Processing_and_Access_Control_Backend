import { Role } from "../constants/roles";

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: Role;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
  isActive: boolean;
}
