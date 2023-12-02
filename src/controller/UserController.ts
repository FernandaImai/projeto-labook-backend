import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import {
  GetUsersInputDTO,
  GetUsersOutputDTO,
  GetUsersSchema,
} from "../dtos/users/getUser.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import {
  SignupInputDTO,
  SignupOutputDTO,
  SignupSchema,
} from "../dtos/users/signup.dto";
import {
  LoginInputDTO,
  LoginOutputDTO,
  LoginSchema,
} from "../dtos/users/login.dto";
import {
  DeleteUserInputDTO,
  DeleteUserOutputDTO,
  DeleteUserSchema,
} from "../dtos/users/deleteUser.dto";
import {
  UpdateUsersInputDTO,
  UpdateUsersOutputDTO,
  UpdateUsersSchema,
} from "../dtos/users/updateUser.dto";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}

  public signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: SignupInputDTO = SignupSchema.parse({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
      });

      const output: SignupOutputDTO = await this.userBusiness.signup(input);
      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: LoginInputDTO = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const output: LoginOutputDTO = await this.userBusiness.login(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      
      const input: GetUsersInputDTO = GetUsersSchema.parse({
        query: req.query.q as string | undefined,
        token: req.headers.authorization,
      });
      
      const output:GetUsersOutputDTO = await this.userBusiness.getUsers(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
        
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public updateUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: UpdateUsersInputDTO = UpdateUsersSchema.parse({
        idToEditUser: req.params.id,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        token: req.headers.authorization,
      });

      const output:UpdateUsersOutputDTO =
        await this.userBusiness.updateUsers(input);
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };

  public deleteUsers = async (req: Request,res: Response): Promise<void> => {
    try {
      const input: DeleteUserInputDTO = DeleteUserSchema.parse({
        idToDelete: req.params.id,
        token: req.headers.authorization,
      });
      await this.userBusiness.deleteUsers(input);
      const output:DeleteUserOutputDTO = {
        message:"Usuário excluído com sucesso"
      }
        
      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado.");
      }
    }
  };
}