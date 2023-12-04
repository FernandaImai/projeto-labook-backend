import { z } from "zod";


export interface UpdatePostInputDTO {
  idToEdit: string;
  content: string;
  token: string;
}


export type UpdatePostOutputDTO = undefined



export const UpdatePostSchema = z
  .object({
    idToEdit: z.string().min(1),
    content: z.string().min(1),
    token: z.string().min(1),
  })
  .transform((data) => data as UpdatePostInputDTO);