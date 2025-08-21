'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import { useState, useRef } from 'react'
import { X } from 'lucide-react'

interface ProfileModalProps {
  userId: string
  currentName?: string
  currentAvatarUrl?: string
  currentPronouns?: string
  currentBio?: string
  triggerElement?: React.ReactNode
  onSuccess?: () => void
}

const ProfileModal = ({
  userId,
  currentName = '',
  currentAvatarUrl = '',
  currentPronouns = '',
  currentBio = '',
  triggerElement,
  onSuccess,
}: ProfileModalProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string>(currentAvatarUrl)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { mutate, isPending, error } = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      setIsOpen(false)
      onSuccess?.()
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentName,
      pronouns: currentPronouns,
      bio: currentBio,
    },
  })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setValue('avatarImage', event.target.files as FileList)
    }
  }

  const removeAvatar = () => {
    setAvatarPreview('')
    setValue('avatarImage', undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: ProfileSchema) => {
    setIsUploading(true)
    let avatarUrl = currentAvatarUrl

    try {
      if (data.avatarImage?.[0]) {
        const formData = new FormData()
        formData.append('file', data.avatarImage[0])

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload avatar')
        }

        const { url } = await response.json()
        avatarUrl = url
      }

      mutate({
        id: userId,
        name: data.name,
        avatarUrl: avatarUrl,
        pronouns: data.pronouns,
        bio: data.bio,
      })
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      reset({
        name: currentName,
        pronouns: currentPronouns,
        bio: currentBio,
      })
      setAvatarPreview(currentAvatarUrl)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerElement || <Button variant="outline">Edit Profile</Button>}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[600px] max-h-[90vh] p-0 gap-0 bg-white z-[10001] border-none shadow-sm rounded-lg flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          {/* Header */}
          <DialogHeader className="px-6 py-4 flex-shrink-0">
            <DialogTitle className="text-lg font-medium text-center">
              Profile information
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 space-y-6">
              {/* Photo Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Photo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl font-semibold overflow-hidden">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        currentName?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-green-600 border-green-600 hover:bg-green-50"
                    >
                      Update
                    </Button>
                    {avatarPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removeAvatar}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels
                  per side.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Name Section */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name*
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  defaultValue={currentName}
                  className="bg-gray-100 border-gray-200"
                  placeholder="Enter your name"
                />
                <div className="flex justify-end">
                  <span className="text-xs text-gray-400">
                    {watch('name')?.length || 0}/50
                  </span>
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Pronouns Section */}
              <div className="space-y-2">
                <Label htmlFor="pronouns" className="text-sm font-medium">
                  Pronouns
                </Label>
                <Input
                  id="pronouns"
                  {...register('pronouns')}
                  defaultValue={currentPronouns}
                  className="bg-gray-100 border-gray-200"
                  placeholder="Add..."
                />
                {errors.pronouns && (
                  <p className="text-red-500 text-sm">
                    {errors.pronouns.message}
                  </p>
                )}
                <div className="flex justify-end">
                  <span className="text-xs text-gray-400">
                    {watch('pronouns')?.length || 0}/4
                  </span>
                </div>
              </div>

              {/* Short bio Section */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium">
                  Short bio
                </Label>
                <textarea
                  id="bio"
                  {...register('bio')}
                  defaultValue={currentBio}
                  className="w-full min-h-[80px] px-3 py-2 bg-gray-100 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about yourself"
                />
                {errors.bio && (
                  <p className="text-red-500 text-sm">{errors.bio.message}</p>
                )}
                <div className="flex justify-end">
                  <span className="text-xs text-gray-400">
                    {watch('bio')?.length || 0}/160
                  </span>
                </div>
              </div>

              {/* About Page Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-medium">About Page</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="p-1 h-auto"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Personalize with images and more to paint more of a vivid
                  portrait of yourself than your 'Short bio.'
                </p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">
                    {error.message ||
                      'An error occurred while updating your profile'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-neutral-300 bg-white flex justify-end gap-3 flex-shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending || isUploading}
              className="rounded-full px-6 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || isUploading}
              className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
            >
              {isPending || isUploading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileModal
