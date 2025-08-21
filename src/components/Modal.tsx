'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { profileSchema, ProfileSchema } from '@/utils/form-schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { trpc } from '@/lib/trpc'
import { DialogClose } from '@radix-ui/react-dialog'

const Modal = ({
  avatarUrl,
  userId,
}: {
  avatarUrl: string
  userId: string
}) => {
  const { mutate, isPending } = trpc.users.updateProfile.useMutation()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit = async (data: ProfileSchema) => {
    console.log('here, submitting')
    let bannerUrl = ''
    console.log(data)

    if (data.avatarImage?.[0]) {
      const formData = new FormData()
      formData.append('file', data.avatarImage?.[0])

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const { url } = await response.json()
      bannerUrl = url
    }

    console.log(bannerUrl)

    mutate({
      id: userId,
      name: data.name,
      avatarUrl: bannerUrl,
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="dark">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register('name')} defaultValue="sakashima" />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="avatarImage">Avatar Image</Label>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                {...register('avatarImage')}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="dark" disabled={isPending}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default Modal
