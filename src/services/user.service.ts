import { Role } from "../constants/roles";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { PublicUser } from "../types/user.types";
import { ApiError } from "../utils/api-error";
import { toPublicUser } from "../utils/user-mapper";
import { IPasswordService } from "./password.service";

export interface CreateManagedUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  isActive?: boolean;
}

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  public async createUser(input: CreateManagedUserInput): Promise<PublicUser> {
    const normalizedEmail = input.email.toLowerCase();
    const existing = await this.userRepository.findByEmail(normalizedEmail);

    if (existing) {
      throw new ApiError(409, "A user with this email already exists");
    }

    const hashedPassword = await this.passwordService.hash(input.password);

    const user = await this.userRepository.create({
      ...input,
      email: normalizedEmail,
      password: hashedPassword
    });

    return toPublicUser(user);
  }

  public async listUsers(): Promise<PublicUser[]> {
    const users = await this.userRepository.list();
    return users.map(toPublicUser);
  }

  public async updateUserRole(userId: string, role: Role): Promise<PublicUser> {
    const user = await this.userRepository.updateById(userId, { role });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return toPublicUser(user);
  }

  public async updateUserStatus(
    userId: string,
    isActive: boolean
  ): Promise<PublicUser> {
    const user = await this.userRepository.updateById(userId, { isActive });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return toPublicUser(user);
  }
}
