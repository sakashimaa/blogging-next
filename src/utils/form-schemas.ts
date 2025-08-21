import { z } from 'zod'

export const writeBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.any().refine(
    (v) => {
      if (typeof v === 'string') return v.trim().length >= 3
      if (v && typeof v === 'object') return true
      return false
    },
    { message: 'Content is required' }
  ),
  bannerImage: z.instanceof(FileList).optional(),
  topics: z.array(z.string()).max(5, 'Topics must be less than 5'),
})

export const profileSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters long')
    .max(50, 'Name must be less than 50 characters'),
  avatarImage: z.instanceof(FileList).optional(),
  pronouns: z
    .string()
    .max(4, 'Pronouns must be less than 4 characters')
    .optional(),
  bio: z.string().max(160, 'Bio must be less than 160 characters').optional(),
})

export type WriteBlogSchema = z.infer<typeof writeBlogSchema>
export type ProfileSchema = z.infer<typeof profileSchema>
