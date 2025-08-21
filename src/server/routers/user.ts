import { db } from '@/db'
import { blogFavorites, blogLikes, blogs, user, userFollows } from '@/db/schema'
import { publicProcedure, router } from '@/server/trpc'
import {
  getUserBlogsSchema,
  getUserByUsernameSchema,
  getUserFavoritesSchema,
  getUserFollowingBlogsSchema,
  getUserLikesSchema,
  getUserSchema,
  updateProfileSchema,
} from '@/utils/zod-schemas'
import { eq } from 'drizzle-orm'

export const userRouter = router({
  byId: publicProcedure.input(getUserSchema).query(async ({ input }) => {
    const result = await db.select().from(user).where(eq(user.id, input.id))
    return result[0]
  }),
  byUsername: publicProcedure
    .input(getUserByUsernameSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: user.id,
          name: user.name,
          authorImageUrl: user.avatarUrl,
          pronouns: user.pronouns,
          bio: user.bio,
        })
        .from(user)
        .where(eq(user.name, input.username))
      return result[0]
    }),
  updateProfile: publicProcedure
    .input(updateProfileSchema)
    .mutation(async ({ input }) => {
      const result = await db
        .update(user)
        .set({
          name: input.name,
          avatarUrl: input.avatarUrl,
          pronouns: input.pronouns,
          bio: input.bio,
        })
        .where(eq(user.id, input.id))
      return result
    }),
  userBlogs: publicProcedure
    .input(getUserBlogsSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          content: blogs.content,
          authorName: user.name,
          authorImageUrl: user.avatarUrl,
          bannerImageUrl: blogs.banner_image_url,
          createdAt: blogs.createdAt,
          updatedAt: blogs.updatedAt,
        })
        .from(blogs)
        .leftJoin(user, eq(user.id, blogs.authorId))
        .where(eq(blogs.authorId, input.authorId))

      return result
    }),
  getUserLikes: publicProcedure
    .input(getUserLikesSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: blogLikes.id,
          blogId: blogLikes.blogId,
          createdAt: blogLikes.createdAt,
        })
        .from(blogLikes)
        .where(eq(blogLikes.userId, input.userId))
      return result
    }),
  getUserFavorites: publicProcedure
    .input(getUserFavoritesSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: blogFavorites.id,
          blogId: blogFavorites.blogId,
          createdAt: blogFavorites.createdAt,
        })
        .from(blogFavorites)
        .where(eq(blogFavorites.userId, input.userId))
      return result
    }),
  getUserFavoriteBlogs: publicProcedure
    .input(getUserFavoritesSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          content: blogs.content,
          authorName: user.name,
          authorImageUrl: user.avatarUrl,
          bannerImageUrl: blogs.banner_image_url,
          createdAt: blogs.createdAt,
        })
        .from(blogFavorites)
        .leftJoin(blogs, eq(blogFavorites.blogId, blogs.id))
        .leftJoin(user, eq(user.id, blogs.authorId))
        .where(eq(blogFavorites.userId, input.userId))

      return result
    }),
  getUserFollowingBlogs: publicProcedure
    .input(getUserFollowingBlogsSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          content: blogs.content,
          authorName: user.name,
          bannerImageUrl: blogs.banner_image_url,
          authorImageUrl: user.avatarUrl,
          createdAt: blogs.createdAt,
        })
        .from(userFollows)
        .leftJoin(blogs, eq(blogs.authorId, userFollows.followingId))
        .leftJoin(user, eq(user.id, blogs.authorId))
        .where(eq(userFollows.followerId, input.userId))

      return result
    }),
})
