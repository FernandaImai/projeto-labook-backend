import { GetPostsInputDTO, GetPostsSchema } from "../dtos/posts/getPost.dto";
import { LikeOrDislikePostSchema } from "../dtos/posts/likeOrDislikePost.dto";
import { Request, Response } from "express";
import { CreatePostSchema } from "../dtos/posts/createPost.dto";
import { DeletePostSchema } from "../dtos/posts/deletePost.dto";
import { UpdatePostSchema } from "../dtos/posts/updatePost.dto";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../errors/BaseError";
import { ZodError } from "zod";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input: GetPostsInputDTO = GetPostsSchema.parse({
        token: req.headers.authorization,
      });

      const response = await this.postBusiness.getPosts(input);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        content: req.body.content,
        token: req.headers.authorization,
      });

      const response = await this.postBusiness.createPost(input);

      res.status(201).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public updatePost = async (req: Request, res: Response) => {
    try {
      const input = UpdatePostSchema.parse({
        token: req.headers.authorization,
        content: req.body.content,
        idToEdit: req.params.id,
      });

      const response = await this.postBusiness.updatePost(input);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
        token: req.headers.authorization,
        idToDelete: req.params.id,
      });

      const response = await this.postBusiness.deletePost(input);

      res.status(200).send(response);
    } catch (error) {
      console.log(error);

      if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikePostSchema.parse({
        token: req.headers.authorization,
        postId: req.params.id,
        like: req.body.like,
      });

      const output = await this.postBusiness.likeOrDislikePost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}