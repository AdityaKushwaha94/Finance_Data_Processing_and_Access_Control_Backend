import bcrypt from "bcryptjs";

export interface IPasswordService {
  hash(value: string): Promise<string>;
  compare(value: string, hash: string): Promise<boolean>;
}

export class BcryptPasswordService implements IPasswordService {
  public async hash(value: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(value, saltRounds);
  }

  public async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
