'use client'

import { Loader2Icon } from 'lucide-react'
import { WriteBlogSchema, writeBlogSchema } from '@/utils/form-schemas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'
import { authClient } from '@/lib/auth-client'
import { useEffect, useState } from 'react'
import Editor from '@/components/Editor'
import PublishBlogDialog from '@/components/PublishBlogDialog'
import { useRouter } from 'next/navigation'

const WriteBlog = () => {
  const user = authClient.useSession()
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [editorContent, setEditorContent] = useState<any>('')
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [topics, setTopics] = useState<string[]>([])

  const { mutate, isPending } = trpc.blogs.create.useMutation({
    onSuccess: (data) => {
      console.log('Blog created successfully:', data)
    },
    onError: (error) => {
      console.error('Failed to create blog:', error)
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WriteBlogSchema>({
    resolver: zodResolver(writeBlogSchema),
    defaultValues: {
      title: '',
      content: '',
      topics: [],
    },
  })

  const bannerImageFile = watch('bannerImage')

  useEffect(() => {
    if (bannerImageFile?.[0]) {
      const file = bannerImageFile[0]
      const preview = URL.createObjectURL(file)
      setPreviewImage(preview)

      return () => URL.revokeObjectURL(preview)
    }
  }, [bannerImageFile])

  useEffect(() => {
    setValue('topics', topics as any, { shouldValidate: true })
  }, [topics, setValue])

  const onSubmit = async (data: WriteBlogSchema) => {
    console.log('onSubmit', data)
    let bannerUrl = ''

    if (data.bannerImage?.[0]) {
      setIsUploading(true)

      const formData = new FormData()
      formData.append('file', data.bannerImage?.[0])

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const { url } = await response.json()
      bannerUrl = url
      setPreviewImage(url)
      setIsUploading(false)
    } else {
      bannerUrl =
        'https://t3.ftcdn.net/jpg/04/28/55/26/360_F_428552673_Is4lKXNIKIt5qVcvOKaf3ZuyStSDPAVX.jpg'
    }

    mutate({
      ...data,
      content: editorContent,
      authorId: user.data?.user.id!,
      bannerImageUrl: bannerUrl,
      topics,
    })

    reset()
    setPreviewImage(null)
    setIsUploading(false)
    setEditorContent(null)
    setTopics([])

    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl">
      {/* Cover section (Notion-like) */}
      <div className="relative h-28 w-full overflow-hidden rounded-b-xl bg-neutral-100 dark:bg-neutral-900">
        <img
          src={
            previewImage
              ? previewImage
              : 'https://t3.ftcdn.net/jpg/04/28/55/26/360_F_428552673_Is4lKXNIKIt5qVcvOKaf3ZuyStSDPAVX.jpg'
          }
          alt="Cover"
          className="h-full w-full object-cover"
        />
        <div className="absolute right-3 top-3 flex items-center gap-2">
          <label
            htmlFor="bannerInput"
            className="cursor-pointer rounded-md px-3 py-1.5 text-sm text-neutral-700 backdrop-blur hover:text-neutral-500"
          >
            {previewImage ? 'Change cover' : 'Add cover'}
          </label>
          <input
            id="bannerInput"
            type="file"
            accept="image/*"
            {...register('bannerImage')}
            className="hidden"
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

      {/* Page body */}
      <div className="px-4 pb-12 pt-6">
        {/* Title */}
        <textarea
          {...register('title')}
          placeholder="Untitled"
          rows={1}
          onInput={(e) => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = `${el.scrollHeight}px`
          }}
          className="w-full bg-transparent text-4xl font-semibold outline-none placeholder:text-neutral-400 md:text-5xl leading-tight resize-none overflow-hidden break-words whitespace-pre-wrap"
        />
        {errors.title?.message && (
          <p className="mt-1 text-sm text-red-600">
            {String(errors.title.message)}
          </p>
        )}

        {/* Content */}
        <div className="mt-6">
          <Editor
            value={editorContent}
            onChange={(val) => {
              setEditorContent(val)
              setValue('content', val as any, { shouldValidate: true })
            }}
          />
          <input type="hidden" {...register('content')} />
          <input type="hidden" {...register('topics')} />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">
              {String((errors.content as any)?.message ?? 'Required')}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="mt-8">
          <PublishBlogDialog
            topics={topics}
            setTopics={setTopics}
            onSubmit={() => {
              handleSubmit(onSubmit)()
            }}
          />
        </div>
      </div>
    </form>
  )
}

export default WriteBlog
