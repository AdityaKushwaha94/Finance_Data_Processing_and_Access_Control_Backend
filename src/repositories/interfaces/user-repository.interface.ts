import { Role } from "../../constants/roles";
import { UserDocument } from "../../models/user.model";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive?: boolean;
}

export interface UpdateUserInput {
  role?: Role;
  isActive?: boolean;
}

export interface IUserRepository {
  create(input: CreateUserInput): Promise<UserDocument>;
  findByEmail(email: string): Promise<UserDocument | null>;
  findById(id: string): Promise<UserDocument | null>;
  list(): Promise<UserDocument[]>;
  updateById(id: string, updates: UpdateUserInput): Promise<UserDocument | null>;
  existsAdmin(): Promise<boolean>;
}
