import { db } from '@/db'
import { blogLikes } from '@/db/schema'
import { publicProcedure, router } from '@/server/trpc'
import { likeBlogSchema } from '@/utils/zod-schemas'
import { and, eq } from 'drizzle-orm'

export const likeRouter = router({
  likeBlog: publicProcedure
    .input(likeBlogSchema)
    .mutation(async ({ input }) => {
      const existingLike = await db
        .select()
        .from(blogLikes)
        .where(
          and(
            eq(blogLikes.blogId, input.blogId),
            eq(blogLikes.userId, input.userId)
          )
        )

      if (existingLike.length > 0) {
        await db.delete(blogLikes).where(eq(blogLikes.id, existingLike[0].id))
        return null
      }

      const [blog] = await db
        .insert(blogLikes)
        .values({
          blogId: input.blogId,
          userId: input.userId,
        })
        .returning()

      return blog
    }),
})
