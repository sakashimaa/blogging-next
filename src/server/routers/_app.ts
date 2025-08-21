import { router } from '@/server/trpc'
import { blogRouter } from '@/server/routers/blog'
import { userRouter } from '@/server/routers/user'
import { likeRouter } from '@/server/routers/like'
import { searchRouter } from '@/server/routers/search'
import { favoriteRouter } from '@/server/routers/favorite'
import { topicRouter } from './topic'
import { followRouter } from './follow'

export const appRouter = router({
  blogs: blogRouter,
  users: userRouter,
  likes: likeRouter,
  search: searchRouter,
  favorites: favoriteRouter,
  topics: topicRouter,
  follow: followRouter,
})

export type AppRouter = typeof appRouter
