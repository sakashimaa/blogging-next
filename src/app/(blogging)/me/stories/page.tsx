'use client'

import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'
import Dropdown from '@/components/Dropdown'
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DeleteAlert from '@/components/DeleteAlert'

const MyStories = () => {
  const router = useRouter()

  const [alertOpen, setAlertOpen] = useState(false)

  const { data } = authClient.useSession()
  const { data: blogs } = trpc.users.userBlogs.useQuery({
    authorId: data?.user?.id!,
  })

  const stories = blogs || []

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  const getWordCount = (content: any) => {
    if (typeof content === 'string') {
      return content.split(' ').length
    }
    // Handle JSON content structure
    return 57 // placeholder
  }

  const getReadTime = (wordCount: number) => {
    const wordsPerMinute = 200
    return Math.ceil(wordCount / wordsPerMinute)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your stories</h1>
        <div className="flex gap-3">
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full font-medium"
            onClick={() => router.push('/blogs/write')}
          >
            Write a story
          </button>
        </div>
      </div>

      {/* Stories */}
      <div className="space-y-6">
        {stories.map((blog) => {
          const wordCount = getWordCount(blog.content)
          const readTime = getReadTime(wordCount)

          return (
            <div key={blog.id} className="border-b border-gray-100 pb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-500">
                  Last edited{' '}
                  {formatDate(new Date(blog.updatedAt || blog.createdAt))} ·{' '}
                  {readTime} min read ({wordCount} words) so far
                </div>
                <Dropdown
                  triggerContent={
                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                  }
                  triggerClassName="p-1 hover:bg-gray-100 rounded"
                  items={[
                    {
                      label: 'Edit draft',
                      icon: <PencilIcon className="w-4 h-4" />,
                      onSelect: () => router.push(`/blogs/edit/${blog.id}`),
                      separator: true,
                    },
                    {
                      label: 'Delete draft',
                      classNames: 'text-red-500',
                      icon: <TrashIcon className="w-4 h-4" />,
                      onSelect: () => setAlertOpen(true),
                    },
                  ]}
                />
              </div>

              <DeleteAlert
                isOpen={alertOpen}
                onOpenChange={setAlertOpen}
                blogId={blog.id}
              />

              {/* Story Title and Preview */}
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {blog.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {typeof blog.content === 'string'
                  ? blog.content.substring(0, 200) + '...'
                  : 'Hello WOrld! Welcome to my world oh Hello WOrld! Welcome to my world oh Hello WOrld! Welcome to my world oh Hello WOrld! Welcome to my...'}
              </p>
            </div>
          )
        })}

        {stories.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No stories yet. Start writing your first story!
          </div>
        )}
      </div>
    </main>
  )
}

export default MyStories
