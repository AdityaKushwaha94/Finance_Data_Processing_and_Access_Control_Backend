import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/api-error";
import { toPublicUser } from "../utils/user-mapper";
import { IUserRepository } from "../repositories/interfaces/user-repository.interface";
import { IPasswordService } from "./password.service";
import { PublicUser } from "../types/user.types";
import { AuthTokenPayload } from "../types/auth.types";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: PublicUser;
}

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  public async register(input: RegisterInput): Promise<AuthResult> {
    const email = input.email.toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError(409, "A user with this email already exists");
    }

    const hashedPassword = await this.passwordService.hash(input.password);
    const createdUser = await this.userRepository.create({
      name: input.name,
      email,
      password: hashedPassword,
      role: "viewer",
      isActive: true
    });

    return {
      token: this.createToken(createdUser.id, createdUser.email, createdUser.role),
      user: toPublicUser(createdUser)
    };
  }

  public async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.userRepository.findByEmail(input.email.toLowerCase());

    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await this.passwordService.compare(
      input.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    if (!user.isActive) {
      throw new ApiError(403, "User account is inactive");
    }

    return {
      token: this.createToken(user.id, user.email, user.role),
      user: toPublicUser(user)
    };
  }

  public async getProfile(userId: string): Promise<PublicUser> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return toPublicUser(user);
  }

  public async ensureDefaultAdmin(): Promise<void> {
    const adminExists = await this.userRepository.existsAdmin();

    if (adminExists) {
      return;
    }

    const hashedPassword = await this.passwordService.hash(env.SEED_ADMIN_PASSWORD);

    await this.userRepository.create({
      name: "System Admin",
      email: env.SEED_ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      isActive: true
    });

    console.log(
      `Default admin user created with email ${env.SEED_ADMIN_EMAIL}. Change the password after first login.`
    );
  }

  private createToken(userId: string, email: string, role: "viewer" | "analyst" | "admin"): string {
    const payload: AuthTokenPayload = {
      sub: userId,
      email,
      role
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"]
    });
  }
}
