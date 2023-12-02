import express  from "express";
import { PostBusiness } from '../business/PostBusiness'
import { PostController } from '../controller/PostController'
import { PostDatabase } from '../database/PostDatabase.ts'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'

export const postsRouter = express.Router()


const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

postsRouter.get("/", postController.getPosts)
postsRouter.post("/", postController.createPost)
postsRouter.put("/:id", postController.updatePost)
postsRouter.delete("/:id", postController.deletePost)
postsRouter.put("/:id/like", postController.likeOrDislikePost)