import { trpc } from '@/lib/trpc'
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { useRouter } from 'next/navigation'

const BlockAlert = ({
  isOpen,
  onOpenChange,
  blogId,
}: {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  blogId: number
}) => {
  const utils = trpc.useUtils()
  const { mutate: blockBlog, isPending } = trpc.blogs.block.useMutation({
    onSuccess: async () => {
      await utils.blogs.allNotBlocked.invalidate()
      onOpenChange(false)
    },
  })

  const router = useRouter()

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="z-[1000]">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              blockBlog({ id: blogId })
              router.push('/')
            }}
            disabled={isPending}
          >
            {isPending ? 'Blocking...' : 'Block'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default BlockAlert
