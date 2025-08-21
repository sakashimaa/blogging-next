'use client'

import { use, useEffect, useState } from 'react'
import { trpc } from '@/lib/trpc'
import Editor from '@/components/Editor'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Loader2Icon } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

const EditBlog = ({ params }: { params: Promise<{ id: string }> }) => {
  const { data: session } = authClient.useSession()
  const { id } = use(params)
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [editorContent, setEditorContent] = useState<any>('')
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const { data: blog, isLoading } = trpc.blogs.one.useQuery({ id: Number(id) })
  const { mutate, isPending } = trpc.blogs.update.useMutation()

  const handleUpdateBlog = () => {
    console.log('Banner URL:', bannerUrl)
    const result = mutate({
      id: Number(id),
      title,
      content: editorContent,
      bannerImageUrl: bannerUrl ?? '',
    })

    console.log(result)
  }

  const handleBannerChange = async (file: File) => {
    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const { url } = await res.json()
      setBannerUrl(url)
    } catch (e) {
      console.error('Failed to upload banner', e)
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (blog) {
      setTitle(blog.title ?? '')
      setEditorContent(blog.content ?? '')
      setBannerUrl(
        blog.bannerImageUrl ||
          'https://t3.ftcdn.net/jpg/04/28/55/26/360_F_428552673_Is4lKXNIKIt5qVcvOKaf3ZuyStSDPAVX.jpg'
      )
    }
  }, [blog])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-foreground/60">
        Загрузка…
      </div>
    )
  }

  if (
    blog?.authorId !== session?.user.id &&
    // @ts-expect-error: role is not defined in the session
    (session?.user.role !== 'admin' || session?.user?.role !== 'moderator')
  ) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-sm text-foreground/60">
        Вы не можете редактировать этот блог
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Cover section (same style as write page) */}
      <div className="relative h-28 w-full overflow-hidden rounded-b-xl bg-neutral-100 dark:bg-neutral-900">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt="Cover"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <label
            htmlFor="bannerInputEdit"
            className="cursor-pointer rounded-md bg-black/80 px-3 py-1.5 text-sm text-white backdrop-blur hover:bg-black"
          >
            {bannerUrl ? 'Change cover' : 'Add cover'}
          </label>
          <input
            id="bannerInputEdit"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleBannerChange(f)
            }}
          />
        </div>
        {isUploading && (
          <div className="absolute inset-0 grid place-items-center bg-black/20">
            <span className="flex items-center gap-2 rounded-md bg-white/90 px-3 py-1.5 text-sm text-neutral-700 shadow">
              <Loader2Icon className="h-4 w-4 animate-spin" /> Uploading…
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pb-12 pt-6">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled"
          className="w-full bg-transparent text-4xl font-semibold outline-none placeholder:text-neutral-400 md:text-5xl"
        />

        {/* Content */}
        <div className="mt-6">
          <Editor
            value={editorContent}
            onChange={(val) => setEditorContent(val)}
          />
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="dark"
            className="flex-1 disabled:opacity-60"
            disabled={isPending || isUploading}
            onClick={handleUpdateBlog}
          >
            {isPending ? (
              <span className="inline-flex items-center gap-2">
                <Loader2Icon className="h-4 w-4 animate-spin" /> Сохранение…
              </span>
            ) : (
              'Подтвердить изменения'
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.back()}
          >
            Отменить
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EditBlog
