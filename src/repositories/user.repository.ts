import {
  CreateUserInput,
  IUserRepository,
  UpdateUserInput
} from "./interfaces/user-repository.interface";
import { UserDocument, UserModel } from "../models/user.model";

export class UserRepository implements IUserRepository {
  public async create(input: CreateUserInput): Promise<UserDocument> {
    return UserModel.create({
      ...input,
      email: input.email.toLowerCase()
    });
  }

  public async findByEmail(email: string): Promise<UserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  }

  public async findById(id: string): Promise<UserDocument | null> {
    return UserModel.findById(id);
  }

  public async list(): Promise<UserDocument[]> {
    return UserModel.find().sort({ createdAt: -1 });
  }

  public async updateById(
    id: string,
    updates: UpdateUserInput
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
  }

  public async existsAdmin(): Promise<boolean> {
    const adminCount = await UserModel.countDocuments({ role: "admin" });
    return adminCount > 0;
  }
}
