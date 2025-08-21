import { db } from '@/db'
import { blogs, blogTopics, topic, user } from '@/db/schema'
import { publicProcedure, router } from '@/server/trpc'
import {
  blockBlogSchema,
  createBlogSchema,
  deleteBlogSchema,
  getBlogSchema,
  getUserBlogsSchema,
  searchSchema,
  updateBlogSchema,
} from '@/utils/zod-schemas'
import { eq, ilike, or } from 'drizzle-orm'

export const blogRouter = router({
  all: publicProcedure.query(async () => {
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
      .from(blogs)
      .leftJoin(user, eq(user.id, blogs.authorId))

    console.log('in blog router:', result)
    return result
  }),
  allNotBlocked: publicProcedure.query(async () => {
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
      .from(blogs)
      .leftJoin(user, eq(user.id, blogs.authorId))
      .where(eq(blogs.isBlocked, false))

    return result
  }),
  one: publicProcedure.input(getBlogSchema).query(async ({ input }) => {
    const result = await db
      .select({
        id: blogs.id,
        title: blogs.title,
        content: blogs.content,
        authorName: user.name,
        authorId: user.id,
        bannerImageUrl: blogs.banner_image_url,
        createdAt: blogs.createdAt,
      })
      .from(blogs)
      .leftJoin(user, eq(user.id, blogs.authorId))
      .where(eq(blogs.id, input.id))

    console.log('in blog router:', result)
    return result[0]
  }),
  create: publicProcedure
    .input(createBlogSchema)
    .mutation(async ({ input }) => {
      const [blog] = await db
        .insert(blogs)
        .values({
          title: input.title,
          content: input.content,
          banner_image_url: input.bannerImageUrl,
          authorId: input.authorId,
        })
        .returning()

      const topicRecords = await Promise.all(
        input.topics.map(async (topicName) => {
          const [existingTopic] = await db
            .select()
            .from(topic)
            .where(eq(topic.name, topicName))
            .limit(1)

          if (existingTopic) {
            return existingTopic
          }

          const [newTopic] = await db
            .insert(topic)
            .values({ name: topicName })
            .returning()

          return newTopic
        })
      )

      await db.insert(blogTopics).values(
        topicRecords.map((topic: any) => ({
          blogId: blog.id,
          topicId: topic.id,
        }))
      )

      return blog
    }),
  update: publicProcedure
    .input(updateBlogSchema)
    .mutation(async ({ input }) => {
      const [blog] = await db
        .update(blogs)
        .set({
          title: input.title,
          content: input.content,
          banner_image_url: input.bannerImageUrl,
        })
        .where(eq(blogs.id, input.id))
        .returning()

      return blog
    }),
  delete: publicProcedure
    .input(deleteBlogSchema)
    .mutation(async ({ input }) => {
      const [blog] = await db
        .delete(blogs)
        .where(eq(blogs.id, input.id))
        .returning()

      return blog
    }),
  block: publicProcedure.input(blockBlogSchema).mutation(async ({ input }) => {
    const [blog] = await db
      .update(blogs)
      .set({
        isBlocked: true,
      })
      .where(eq(blogs.id, input.id))
      .returning()

    return blog
  }),
})
