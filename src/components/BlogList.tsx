import { SearchX } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import BlogCard from './BlogCard'

type Props = {
  data:
    | {
        id: number | null
        authorName?: string | null
        title: string | null
        bannerImageUrl: string | null
        authorImageUrl?: string | null
        createdAt: string | null
        content?: unknown
      }[]
    | undefined
  userId: string
}

const BlogList = ({ data, userId }: Props) => {
  const { data: userLikes } = trpc.users.getUserLikes.useQuery({ userId })
  const { data: userFavorites } = trpc.users.getUserFavorites.useQuery({
    userId,
  })

  if (!data || data.length === 0) {
    return (
      <div className="grid place-items-center py-20">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-neutral-100 text-neutral-500">
            <SearchX className="size-6" />
          </div>
          <h3 className="text-lg font-semibold">Блоги не найдены</h3>
          <p className="text-neutral-600 mt-1">
            Попробуйте изменить запрос или просмотрите все последние записи.
          </p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-8">
      {data?.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          userFavorites={userFavorites}
          userLikes={userLikes}
          userId={userId}
        />
      ))}
    </div>
  )
}

export default BlogList
