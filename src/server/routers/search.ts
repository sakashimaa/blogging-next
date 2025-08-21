import { db } from '@/db'
import { blogs } from '@/db/schema'
import { publicProcedure, router } from '@/server/trpc'
import { searchSchema } from '@/utils/zod-schemas'
import { ilike, or } from 'drizzle-orm'

export const searchRouter = router({
  search: publicProcedure.input(searchSchema).query(async ({ input }) => {
    try {
      if (!input.search || input.search.trim().length === 0) {
        const result = await db
          .select({
            id: blogs.id,
            title: blogs.title,
            content: blogs.content,
            bannerImageUrl: blogs.banner_image_url,
            createdAt: blogs.createdAt,
          })
          .from(blogs)

        return result
      }

      const searchTerm = input.search.trim()

      const result = await db
        .select({
          id: blogs.id,
          title: blogs.title,
          content: blogs.content,
          bannerImageUrl: blogs.banner_image_url,
          createdAt: blogs.createdAt,
        })
        .from(blogs)
        .where(or(ilike(blogs.title, `%${searchTerm}%`)))

      return result
    } catch (error) {
      console.error('Error in search query:', error)
      throw error
    }
  }),
})
