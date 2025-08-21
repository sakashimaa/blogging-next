import { db } from '@/db'
import { userFollows } from '@/db/schema'
import { router, publicProcedure } from '@/server/trpc'
import {
  followUserSchema,
  getUserFollowersSchema,
  getUserFollowingSchema,
} from '@/utils/zod-schemas'
import { eq, and } from 'drizzle-orm'

export const followRouter = router({
  followUser: publicProcedure
    .input(followUserSchema)
    .mutation(async ({ input }) => {
      const result = await db
        .insert(userFollows)
        .values({
          followerId: input.followerId,
          followingId: input.followingId,
        })
        .onConflictDoNothing()
        .returning()
      return result
    }),
  unfollowUser: publicProcedure
    .input(followUserSchema)
    .mutation(async ({ input }) => {
      const result = await db
        .delete(userFollows)
        .where(
          and(
            eq(userFollows.followerId, input.followerId),
            eq(userFollows.followingId, input.followingId)
          )
        )
        .returning()
      return result
    }),
  getUserFollowing: publicProcedure
    .input(getUserFollowingSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: userFollows.id,
          followerId: userFollows.followerId,
          followingId: userFollows.followingId,
          createdAt: userFollows.createdAt,
          updatedAt: userFollows.updatedAt,
        })
        .from(userFollows)
        .where(eq(userFollows.followerId, input.followerId))
      return result
    }),
  getUserFollowers: publicProcedure
    .input(getUserFollowersSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: userFollows.id,
          followerId: userFollows.followerId,
          followingId: userFollows.followingId,
          createdAt: userFollows.createdAt,
          updatedAt: userFollows.updatedAt,
        })
        .from(userFollows)
        .where(eq(userFollows.followingId, input.userId))
      return result
    }),
})
