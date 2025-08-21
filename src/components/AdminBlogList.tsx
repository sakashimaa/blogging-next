import { getSnippet } from '@/utils/blog'
import Link from 'next/link'
import { Menu, Pencil, SearchX } from 'lucide-react'
import Dropdown from '@/components/Dropdown'

type Props = {
  data:
    | {
        id: number
        authorName?: string | null
        title: string
        bannerImageUrl: string
        createdAt: string
        content?: unknown
      }[]
    | undefined
}

const AdminBlogList = ({ data }: Props) => {
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
        <Link href={`/blogs/${blog.id}`} key={blog.id}>
          <article className="border-b pb-8 last:border-b-0 bg-neutral-50 p-8 rounded-md mb-4">
            <div className="flex gap-6">
              <div className="flex-1">
                <div className="mb-2 text-sm text-neutral-500">
                  {blog.authorName ? blog.authorName : 'Unknown'}
                </div>
                <h2 className="mb-2 text-2xl font-bold leading-snug">
                  {blog.title}
                </h2>
                <p className="text-neutral-600">{getSnippet(blog.content)}</p>
              </div>
              {blog.bannerImageUrl ? (
                <img
                  src={blog.bannerImageUrl}
                  alt="Banner"
                  className="h-28 w-40 flex-none rounded-md object-cover"
                />
              ) : null}
              <Dropdown
                triggerContent={<Menu />}
                items={[
                  {
                    label: 'Edit',
                    icon: <Pencil />,
                    onSelect = {},
                  },
                ]}
              />
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}

export default AdminBlogList
