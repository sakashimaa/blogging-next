'use client'

import BlockAlert from '@/components/BlockAlert'
import { BlogView } from '@/components/BlogView'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteAlert from '@/components/DeleteAlert'
import { Separator } from '@/components/ui/separator'

const GetBlog = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params)
  const router = useRouter()
  const [alertOpen, setAlertOpen] = useState(false)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)

  const { data, isLoading } = trpc.blogs.one.useQuery({ id: Number(id) })
  const { mutate: blockBlog } = trpc.blogs.block.useMutation()

  const { data: session } = authClient.useSession()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!data) {
    return <div>Blog not found</div>
  }

  const getPlainText = (node: any): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (Array.isArray(node)) return node.map(getPlainText).join(' ')
    if (node.type === 'text' && node.text) return node.text
    if (node.content) return getPlainText(node.content)
    return ''
  }

  const getSnippet = (content: any, words = 22): string => {
    const text = getPlainText(content).replace(/\s+/g, ' ').trim()
    if (!text) return ''
    const parts = text.split(' ')
    const short = parts.slice(0, words).join(' ')
    return parts.length > words ? short + '…' : short
  }

  const createdAt = data.createdAt ? new Date(data.createdAt) : null
  const formattedDate = createdAt
    ? createdAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  const handleBlock = () => {
    blockBlog({ id: data.id })
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
        {data.title}
      </h1>
      <p className="mt-3 text-xl text-neutral-600">
        {getSnippet(data.content)}
      </p>

      {/* Author row */}
      <div className="mt-6 flex items-center gap-3 text-sm text-neutral-600">
        <img
          src="https://placehold.co/64x64/png"
          alt="author avatar"
          className="h-9 w-9 rounded-full object-cover"
        />
        <span className="font-medium text-neutral-800">
          {data.authorName ?? 'Unknown'}
        </span>
        <span>•</span>
        <span>{formattedDate}</span>
      </div>

      {/* Body */}
      <div className="mt-8">
        {data.bannerImageUrl && (
          <img
            src={data.bannerImageUrl}
            alt="Banner"
            className="mb-8 w-full rounded-md object-cover"
          />
        )}
        <BlogView content={data.content} />
        {session?.user.id === data.authorId && (
          <div className="mt-4 flex flex-row gap-2">
            <Button
              variant="dark"
              className="flex-1"
              onClick={() => router.push(`/blogs/edit/${id}`)}
            >
              Edit
            </Button>
            <Button
              variant="dark"
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={() => setDeleteAlertOpen(true)}
            >
              Delete
            </Button>

            <DeleteAlert
              isOpen={deleteAlertOpen}
              onOpenChange={setDeleteAlertOpen}
              blogId={data.id}
            />
          </div>
        )}
        {session?.user.role === 'admin' && (
          <>
            <Separator className="my-4" />
            <div className="mt-4">
              <Button
                variant="dark"
                onClick={() => setAlertOpen(true)}
                className="w-full bg-neutral-500 hover:bg-neutral-600"
              >
                Block
              </Button>
              <BlockAlert
                isOpen={alertOpen}
                onOpenChange={setAlertOpen}
                blogId={data.id}
              />
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default GetBlog
