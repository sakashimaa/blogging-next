import { trpc } from '@/lib/trpc'
import { getSnippet } from '@/utils/blog'
import { Bookmark, HeartIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {
  blog: {
    id: number | null
    authorName?: string | null
    title: string | null
    bannerImageUrl: string | null
    authorImageUrl?: string | null
    createdAt: string | null
    content?: unknown
  }
  userFavorites:
    | {
        id: number
        blogId: number
        createdAt: string | Date
      }[]
    | undefined
  userLikes:
    | {
        id: number
        blogId: number
        createdAt: string | Date
      }[]
    | undefined
  userId: string
}

const BlogCard = ({ blog, userFavorites, userLikes, userId }: Props) => {
  const utils = trpc.useUtils()
  const { mutate: likeBlog } = trpc.likes.likeBlog.useMutation({
    onMutate: async (variables) => {
      await utils.users.getUserLikes.cancel()
      const previous = utils.users.getUserLikes.getData({ userId })
      const isLiked = previous?.some((l) => l.blogId === variables.blogId)
      utils.users.getUserLikes.setData({ userId }, (old) => {
        const safe = old ?? []
        if (isLiked) {
          return safe.filter((l) => l.blogId !== variables.blogId)
        }
        return [
          ...safe,
          {
            id: -Date.now(),
            blogId: variables.blogId,
            createdAt: new Date() as any,
          },
        ]
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        utils.users.getUserLikes.setData({ userId }, context.previous)
      }
    },
    onSettled: async () => {
      await utils.users.getUserLikes.invalidate()
      await utils.blogs.allNotBlocked.invalidate()
    },
  })
  const { mutate: addFavorite } = trpc.favorites.addFavorite.useMutation({
    onMutate: async (variables) => {
      await utils.users.getUserFavorites.cancel()
      await utils.users.getUserFavoriteBlogs.cancel()
      const prevFavs = utils.users.getUserFavorites.getData({ userId })
      const prevFavBlogs = utils.users.getUserFavoriteBlogs.getData({ userId })
      const isFav = prevFavs?.some((f) => f.blogId === variables.blogId)
      utils.users.getUserFavorites.setData({ userId }, (old) => {
        const safe = old ?? []
        if (isFav) {
          return safe.filter((f) => f.blogId !== variables.blogId)
        }
        return [
          ...safe,
          {
            id: -Date.now(),
            blogId: variables.blogId,
            createdAt: new Date() as any,
          },
        ]
      })
      if (prevFavBlogs && blog.id === variables.blogId) {
        utils.users.getUserFavoriteBlogs.setData({ userId }, (old) => {
          if (!old) return old
          const exists = old.some((b) => b.id === variables.blogId)
          if (exists) {
            return old.filter((b) => b.id !== variables.blogId)
          }
          return [...old, blog as any]
        })
      }
      return { prevFavs, prevFavBlogs }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prevFavs)
        utils.users.getUserFavorites.setData({ userId }, ctx.prevFavs)
      if (ctx?.prevFavBlogs)
        utils.users.getUserFavoriteBlogs.setData({ userId }, ctx.prevFavBlogs)
    },
    onSettled: async () => {
      await utils.users.getUserFavorites.invalidate()
      await utils.users.getUserFavoriteBlogs.invalidate()
      await utils.blogs.allNotBlocked.invalidate()
    },
  })

  return (
    <article
      className="pb-8 last:border-b-0 bg-neutral-50 p-8 rounded-md mb-4"
      key={blog.id}
    >
      <div className="flex gap-6">
        <div className="flex-1">
          <Link href={`/@${blog.authorName}`} className="hover:underline">
            <div className="mb-2 text-sm text-neutral-500 flex flex-row gap-2 items-center">
              <img
                src={blog.authorImageUrl!}
                alt="avatar"
                className="w-6 h-6 rounded-full"
              />
              <span>{blog.authorName ? blog.authorName : 'Unknown'}</span>
            </div>
          </Link>

          <Link href={`/blogs/${blog.id}`}>
            <h2 className="mb-2 text-2xl font-bold leading-snug">
              {blog.title}
            </h2>
            <p className="text-neutral-600">{getSnippet(blog.content)}</p>
          </Link>
        </div>
        {blog.bannerImageUrl ? (
          <Link href={`/blogs/${blog.id}`}>
            <img
              src={blog.bannerImageUrl}
              alt="Banner"
              className="h-28 w-40 flex-none rounded-md object-cover"
            />
          </Link>
        ) : null}
      </div>
      <div className="flex gap-2">
        <HeartIcon
          className={`size-4 hover:text-red-500 cursor-pointer ${
            userLikes?.some((like) => like.blogId === blog.id)
              ? 'text-red-500'
              : ''
          }`}
          onClick={() => likeBlog({ blogId: blog.id!, userId })}
        />
        <Bookmark
          className={`size-4 hover:text-blue-500 cursor-pointer ${
            userFavorites?.some((favorite) => favorite.blogId === blog.id)
              ? 'text-blue-500'
              : ''
          }`}
          onClick={() => addFavorite({ blogId: blog.id!, userId })}
        />
      </div>
    </article>
  )
}

export default BlogCard
