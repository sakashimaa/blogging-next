import { db } from '@/db'
import { blogFavorites } from '@/db/schema'
import { publicProcedure, router } from '@/server/trpc'
import { addFavoriteSchema } from '@/utils/zod-schemas'
import { and, eq } from 'drizzle-orm'

export const favoriteRouter = router({
  addFavorite: publicProcedure
    .input(addFavoriteSchema)
    .mutation(async ({ input }) => {
      const { userId, blogId } = input
      const existingFavorite = await db
        .select()
        .from(blogFavorites)
        .where(
          and(
            eq(blogFavorites.userId, userId),
            eq(blogFavorites.blogId, blogId)
          )
        )

      if (existingFavorite.length > 0) {
        await db
          .delete(blogFavorites)
          .where(eq(blogFavorites.id, existingFavorite[0].id))
        return null
      }

      const [favorite] = await db
        .insert(blogFavorites)
        .values({
          blogId,
          userId,
        })
        .returning()

      return favorite
    }),
})
