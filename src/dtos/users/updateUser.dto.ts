import z from "zod";

export interface UpdateUsersInputDTO {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateUsersOutputDTO {
  message: string;
  users: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
  };
}

export const UpdateUsersSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.string().min(2),
  })
  .transform((data) => data as UpdateUsersInputDTO);