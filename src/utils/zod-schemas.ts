import { z } from 'zod'

export const createBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  // TipTap JSON: allow arbitrary keys and arrays, but ensure it's an object
  content: z
    .object({})
    .passthrough()
    .refine((v) => v && typeof v === 'object', {
      message: 'Content is required',
    }),
  bannerImageUrl: z.url('Invalid URL'),
  authorId: z.string(),
  topics: z.array(z.string()),
})

export const getBlogSchema = z.object({
  id: z.number(),
})

export const deleteBlogSchema = z.object({
  id: z.number(),
})

export const getUserBlogsSchema = z.object({
  authorId: z.string(),
})

export const updateBlogSchema = z.object({
  id: z.number(),
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  // TipTap JSON: allow arbitrary keys and arrays, but ensure it's an object
  content: z
    .object({})
    .passthrough()
    .refine((v) => v && typeof v === 'object', {
      message: 'Content is required',
    }),
  bannerImageUrl: z.string().optional(),
})

export const getUserSchema = z.object({
  id: z.string(),
})

export const updateProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatarUrl: z.string().optional(),
  pronouns: z.string().optional(),
  bio: z.string().optional(),
})

export const searchSchema = z.object({
  search: z.string(),
})

export const blockBlogSchema = z.object({
  id: z.number(),
})

export const likeBlogSchema = z.object({
  blogId: z.number(),
  userId: z.string(),
})

export const getUserLikesSchema = z.object({
  userId: z.string(),
})

export const getUserFavoritesSchema = z.object({
  userId: z.string(),
})

export const addFavoriteSchema = z.object({
  blogId: z.number(),
  userId: z.string(),
})

export const createManyTopicsSchema = z.object({
  names: z.array(z.string()),
})

export const getUserByUsernameSchema = z.object({
  username: z.string(),
})

export const followUserSchema = z.object({
  followerId: z.string(),
  followingId: z.string(),
})

export const getUserFollowingSchema = z.object({
  followerId: z.string(),
})

export const getUserFollowersSchema = z.object({
  userId: z.string(),
})

export const getTopicStoriesCountSchema = z.object({
  topicId: z.number(),
})

export const getTopicByTitleSchema = z.object({
  title: z.string(),
})

export const getTopicFollowersCountSchema = z.object({
  topicId: z.number(),
})

export const followTopicSchema = z.object({
  userId: z.string(),
  topicId: z.number(),
})

export const getUserTopicFollowSchema = z.object({
  userId: z.string(),
  topicId: z.number(),
})

export const getTopicBlogsSchema = z.object({
  topicId: z.number(),
})

export const getUserFollowingBlogsSchema = z.object({
  userId: z.string(),
})
