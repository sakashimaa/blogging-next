import { db } from '@/db'
import { blogs, blogTopics, topic, topicFollows, user } from '@/db/schema'
import { publicProcedure, router } from '@/server/trpc'
import {
  createManyTopicsSchema,
  followTopicSchema,
  getTopicBlogsSchema,
  getTopicByTitleSchema,
  getTopicFollowersCountSchema,
  getTopicStoriesCountSchema,
  getUserTopicFollowSchema,
} from '@/utils/zod-schemas'
import { and, count, eq, sql } from 'drizzle-orm'

export const topicRouter = router({
  getAll: publicProcedure.query(async () => {
    const topics = await db.select().from(topic)
    return topics
  }),
  createMany: publicProcedure
    .input(createManyTopicsSchema)
    .mutation(async ({ input }) => {
      await Promise.all(
        input.names.map(async (name) => {
          const isExisting = await db
            .select()
            .from(topic)
            .where(eq(topic.name, name))

          if (isExisting.length > 0) return

          name = name.toLowerCase()
          await db.insert(topic).values({ name }).onConflictDoNothing()
        })
      )
    }),
  getTopicStoriesCount: publicProcedure
    .input(getTopicStoriesCountSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({ count: count() })
        .from(blogTopics)
        .where(eq(blogTopics.topicId, input.topicId))

      return result[0]?.count ?? 0
    }),
  getTopicByTitle: publicProcedure
    .input(getTopicByTitleSchema)
    .query(async ({ input }) => {
      const result = await db
        .select()
        .from(topic)
        .where(eq(sql`lower(${topic.name})`, input.title.toLowerCase()))

      return result[0] ?? null
    }),
  getTopicFollowersCount: publicProcedure
    .input(getTopicFollowersCountSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({ count: count() })
        .from(topicFollows)
        .where(eq(topicFollows.topicId, input.topicId))

      return result[0]?.count ?? 0
    }),
  followTopic: publicProcedure
    .input(followTopicSchema)
    .mutation(async ({ input }) => {
      const result = await db
        .insert(topicFollows)
        .values({ userId: input.userId, topicId: input.topicId })
        .onConflictDoNothing()
        .returning()

      return result
    }),
  unfollowTopic: publicProcedure
    .input(followTopicSchema)
    .mutation(async ({ input }) => {
      const result = await db
        .delete(topicFollows)
        .where(
          and(
            eq(topicFollows.userId, input.userId),
            eq(topicFollows.topicId, input.topicId)
          )
        )
        .returning()
      return result
    }),
  getIsUserFollowing: publicProcedure
    .input(getUserTopicFollowSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({ count: count() })
        .from(topicFollows)
        .where(
          and(
            eq(topicFollows.userId, input.userId),
            eq(topicFollows.topicId, input.topicId)
          )
        )
      return (result[0]?.count ?? 0) > 0
    }),
  getTopicBlogs: publicProcedure
    .input(getTopicBlogsSchema)
    .query(async ({ input }) => {
      const result = await db
        .select({
          id: blogs.id,
          authorName: user.name,
          authorImageUrl: user.avatarUrl,
          title: blogs.title,
          bannerImageUrl: blogs.banner_image_url,
          createdAt: blogs.createdAt,
          content: blogs.content,
        })
        .from(blogTopics)
        .innerJoin(blogs, eq(blogTopics.blogId, blogs.id))
        .innerJoin(user, eq(blogs.authorId, user.id))
        .where(eq(blogTopics.topicId, input.topicId))

      return result
    }),
})
