import { UserDatabase } from "../database/UserDatabase"
import { GetUsersInputDTO, GetUsersOutputDTO } from "../dtos/users/getUser.dto"
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login.dto"
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto"
import { UpdateUsersInputDTO, UpdateUsersOutputDTO } from "../dtos/users/updateUser.dto"
import { DeleteUserInputDTO } from "../dtos/users/deleteUser.dto"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { USER_ROLES, User } from "../models/User"
import { HashManager } from "../services/HashManager"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager, TokenPayload } from "../services/TokenManager"
import { UserDB } from "../types"
import { UnauthorizedError } from "../errors/UnauthorizedError"

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
      ) {}
    

      public getUsers = async (
        input: GetUsersInputDTO ): Promise<GetUsersOutputDTO> => {
        const { query, token } = input;
    
        const payload: TokenPayload|null = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError("Acesso não autorizado");
          }
    
        if (payload.role !== USER_ROLES.ADMIN) {
          throw new BadRequestError("Somente administradores podem acessar esse recurso");
        }
    
        const usersDB = await this.userDatabase.findUsers(query);
    
        const users = usersDB.map((userDB) => {
          const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role as USER_ROLES,
            userDB.created_at
          );
    
          return user.toBusinessModel();
        });
    
        const output: GetUsersOutputDTO = users;
    
        return output;
      };
    
      public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { name, email, password } = input;
    
        const id = this.idGenerator.generate();
    
        const userDBExists = await this.userDatabase.findUserById(id);
    
        if (userDBExists) {
          throw new BadRequestError("'id' já existente");
        }
    
        const hashedPassword: string = await this.hashManager.hash(password);
    
        const newUser = new User(
          id,
          name,
          email,
          hashedPassword,
          USER_ROLES.NORMAL,
          new Date().toISOString()
        );
    
        const newUserDB = newUser.toDBModel();
        await this.userDatabase.insertUser(newUserDB);
    
        const payload: TokenPayload = {
          id: newUser.getId(),
          name: newUser.getName(),
          role: newUser.getRole(),
        };
    
        const token = this.tokenManager.createToken(payload);
    
        const output: SignupOutputDTO = {
          message: "Cadastro realizado com sucesso",
          token,
        };
    
        return output;
      };
    
      public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input;
    
        const userDB = await this.userDatabase.findUserByEmail(email);
    
        if (!userDB) {
          throw new NotFoundError("'email' não encontrado");
        }
        
        const hashedPassword:string = userDB.password;
    
        
        const isPasswordCorrect:boolean = await this.hashManager.compare(
          password,
          hashedPassword
        );
    
        
        if (!isPasswordCorrect) {
          throw new BadRequestError("'email' ou 'senha' incorretos");
        }
    
        const user = new User(
          userDB.id,
          userDB.name,
          userDB.email,
          userDB.password,
          userDB.role as USER_ROLES,
          new Date().toISOString()
        );
    
        const payload: TokenPayload = {
          id: user.getId(),
          name: user.getName(),
          role: user.getRole(),
        };
    
        const token = this.tokenManager.createToken(payload);
    
        const output: LoginOutputDTO = {
          message: "Login realizado com sucesso",
          token,
        };
    
        return output;
      };
    
      public updateUsers = async (
        input: UpdateUsersInputDTO): Promise<UpdateUsersOutputDTO> => {
        const { id, name, email, password, role } = input;

        if (!id && !name && !email && !password && !role) {
          throw new BadRequestError("Pelo menos um campo deve ser fornecido para a atualização");
        }
    
        const userDBExists = await this.userDatabase.findUserById(id);
    
        if (!userDBExists) {
          throw new BadRequestError("Usuário não econtrado");
        }
    
        const user = new User(
          userDBExists.id,
          userDBExists.name,
          userDBExists.email,
          userDBExists.password,
          userDBExists.role as USER_ROLES,
          userDBExists.created_at
        );
    
        id && user.setId(id);
        name && user.setName(name);
        email && user.setEmail(email);
        password && user.setPassword(password);
        role && user.setRole(role as USER_ROLES);
    
        const updateUserDB: UserDB = {
          id: user.getId(),
          name: user.getName(),
          email: user.getEmail(),
          password: user.getPassword(),
          role: user.getRole(),
          created_at: user.getCreatedAt(),
        };
    
        await this.userDatabase.updateUser(updateUserDB);
    
        const output: UpdateUsersOutputDTO = {
          message: "Cadastro atualizado com sucesso",
          users: {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            createdAt: user.getCreatedAt(),
          },
        };
    
        return output;
      };
    
      public deleteUsers = async (input: DeleteUserInputDTO): Promise<User> => {
        const { idToDelete } = input;
    
        if (typeof idToDelete !== "string") {
          throw new BadRequestError("'id' deve ser uma string");
        }
    
        const userDBExists = await this.userDatabase.findUserById(idToDelete);
    
        if (!userDBExists) {
          throw new BadRequestError("Não foi possível encontrar o usuário");
        }
    
        await this.userDatabase.deleteUser(idToDelete);
    
        const user: User = new User(
          userDBExists.id,
          userDBExists.name,
          userDBExists.email,
          userDBExists.password,
          userDBExists.role as USER_ROLES,
          userDBExists.created_at
        );
        return user;
      };
    }