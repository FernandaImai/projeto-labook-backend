import { LikeDislikeDB, POST_LIKE, PostDBWithCreatorName } from "../models/Post";
import { PostDB } from "../types";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POST = "posts";
    public static TABLE_LIKES_DISLIKES = "likes_dislikes"

    public async findPostsWithCreatorName(): Promise<PostDBWithCreatorName[]> {
        const postsDB: PostDBWithCreatorName[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .select(
                `${PostDatabase.TABLE_POST}.id`,
                `${PostDatabase.TABLE_POST}.creator_id`,
                `${PostDatabase.TABLE_POST}.content`,
                `${PostDatabase.TABLE_POST}.likes`,
                `${PostDatabase.TABLE_POST}.dislikes`,
                `${PostDatabase.TABLE_POST}.created_at`,
                `${PostDatabase.TABLE_POST}.updated_at`,
                `${UserDatabase.TABLE_USERS}.name as creator_name`
              )
              .join(
                `${UserDatabase.TABLE_USERS}`,
                `${PostDatabase.TABLE_POST}.creator_id`,
                "=",
                `${UserDatabase.TABLE_USERS}.id`
              );
            return postsDB;
        
    }

    public async findPostById(id: string): Promise<PostDB | undefined> {
        const [ postsDB ]: PostDB[] | undefined[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .where({ id })

        return postsDB
    }

    public async insertPost(newPost: PostDB):Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .insert(newPost)
    }

    public async updatePost(newPost : PostDB):Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POST)
            .where({ id: newPost.id })
            .update({
                    creator_id: newPost.creator_id,
                    content: newPost.content,
                    likes: newPost.likes,
                    dislikes: newPost.dislikes,
      });
    }
    public async deletePost(id: string): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POST)
          .where({ id })
          .delete();
      }


      public findPostWithCreatorNameById = async (
        id: string
      ): Promise<PostDBWithCreatorName | undefined> => {
        const [result] = await BaseDatabase
          .connection(PostDatabase.TABLE_POST)
          .select(
            `${PostDatabase.TABLE_POST}.id`,
            `${PostDatabase.TABLE_POST}.creator_id`,
            `${PostDatabase.TABLE_POST}.content`,
            `${PostDatabase.TABLE_POST}.likes`,
            `${PostDatabase.TABLE_POST}.dislikes`,
            `${PostDatabase.TABLE_POST}.created_at`,
            `${PostDatabase.TABLE_POST}.updated_at`,
            `${UserDatabase.TABLE_USERS}.name as creator_name`
          )
          .join(
            `${UserDatabase.TABLE_USERS}`,
            `${PostDatabase.TABLE_POST}.creator_id`,
            "=",
            `${UserDatabase.TABLE_USERS}.id`
          )
          .where({ [`${PostDatabase.TABLE_POST}.id`]: id });
    
        return result as PostDBWithCreatorName | undefined;
      };
    
      public findLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<POST_LIKE | undefined> => {
        const [result]: Array<LikeDislikeDB | undefined> =
          await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .select()
            .where({
              user_id: likeDislikeDB.user_id,
              post_id: likeDislikeDB.post_id,
            });
    
        if (result === undefined) {
          return undefined;
        } else if (result.like === 1) {
          return POST_LIKE.ALREADY_LIKED;
        } else {
          return POST_LIKE.ALREADY_DISLIKED;
        }
      };
    
      public removeLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
        await BaseDatabase
          .connection(PostDatabase.TABLE_LIKES_DISLIKES)
          .delete()
          .where({
            user_id: likeDislikeDB.user_id,
            post_id: likeDislikeDB.post_id,
          });
      };
    
      public updateLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
        await BaseDatabase
          .connection(PostDatabase.TABLE_LIKES_DISLIKES)
          .update(likeDislikeDB)
          .where({
            user_id: likeDislikeDB.user_id,
            post_id: likeDislikeDB.post_id,
          });
      };
    
      public insertLikeDislike = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {
        await BaseDatabase
        .connection(PostDatabase.TABLE_LIKES_DISLIKES)
        .insert(likeDislikeDB);
      };

}
