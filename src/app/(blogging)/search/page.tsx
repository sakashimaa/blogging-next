'use client'

import { trpc } from '@/lib/trpc'
import { useSearchParams } from 'next/navigation'
import BlogList from '@/components/BlogList'
import { authClient } from '@/lib/auth-client'

const SearchBlogs = () => {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')
  const { data: session } = authClient.useSession()
  const { data, isLoading, isError, error } = trpc.search.search.useQuery({
    search: search || '',
  })

  const SkeletonCard = () => (
    <div className="border-b pb-8 last:border-b-0 bg-neutral-50 p-8 rounded-md mb-4 animate-pulse">
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="h-4 w-24 bg-neutral-200 rounded mb-3" />
          <div className="h-6 w-3/5 bg-neutral-200 rounded mb-3" />
          <div className="h-4 w-4/5 bg-neutral-200 rounded" />
        </div>
        <div className="h-28 w-40 bg-neutral-200 rounded-md" />
      </div>
    </div>
  )

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-1 mt-5">
      {isLoading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : isError ? (
        <div className="rounded-md border bg-red-50 text-red-700 p-6">
          <p className="font-medium">Ошибка при поиске блогов</p>
          <p className="text-sm opacity-80 mt-1">
            {error?.message ?? 'Попробуйте снова позже.'}
          </p>
        </div>
      ) : (
        <>
          {/* Показать текущий запрос */}
          <div className="mb-4 text-sm text-neutral-600">
            {search && search.trim().length > 0 ? (
              <>
                Результаты по запросу:{' '}
                <span className="font-medium">"{search}"</span>
                {Array.isArray(data) ? ` • ${data.length}` : ''}
              </>
            ) : (
              <span className="opacity-80">Все блоги</span>
            )}
          </div>
          <BlogList data={data} userId={session?.user.id!} />
        </>
      )}
    </main>
  )
}

export default SearchBlogs
