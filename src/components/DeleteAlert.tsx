'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { trpc } from '@/lib/trpc'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const DeleteAlert = ({
  isOpen,
  onOpenChange,
  blogId,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  blogId: number
}) => {
  const utils = trpc.useUtils()
  const { mutate, isPending } = trpc.blogs.delete.useMutation({
    onSuccess: async () => {
      await utils.users.userBlogs.invalidate()
      onOpenChange(false)
    },
  })

  const router = useRouter()

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="z-[1000]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your blog
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              mutate({ id: blogId })
              router.push('/')
            }}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteAlert
