import { z } from "zod";


export interface UpdatePostInputDTO {
  id: string;
  content: string;
  token: string;
}

export interface UpdatePostOutputDTO {
  message: string;
}


export const UpdatePostSchema = z
  .object({
    id: z.string().min(1),
    content: z.string().min(2),
    token: z.string().min(1),
  })
  .transform((data) => data as UpdatePostInputDTO);