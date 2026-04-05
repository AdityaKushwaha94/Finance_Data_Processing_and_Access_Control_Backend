import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
  constructor(private readonly userService: UserService) {}

  public createUser = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user
    });
  };

  public listUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await this.userService.listUsers();

    res.status(200).json({
      success: true,
      data: users
    });
  };

  public updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const user = await this.userService.updateUserRole(id, req.body.role);

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: user
    });
  };

  public updateUserStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params as { id: string };
    const user = await this.userService.updateUserStatus(
      id,
      req.body.isActive
    );

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user
    });
  };
}
