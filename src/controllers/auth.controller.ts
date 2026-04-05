import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });
  };

  public me = async (req: Request, res: Response): Promise<void> => {
    const profile = await this.authService.getProfile(req.authUser!.id);

    res.status(200).json({
      success: true,
      data: profile
    });
  };
}
