import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  pgEnum,
  unique,
} from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['user', 'admin', 'moderator'])

export const blogs = pgTable('blogs', {
  id: serial('id').primaryKey(),

  title: varchar({ length: 255 }).notNull(),
  content: jsonb('content').notNull(),
  banner_image_url: varchar({ length: 255 }).notNull(),

  authorId: text('author_id'),
  isBlocked: boolean('is_blocked').notNull().default(false),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const blogLikes = pgTable(
  'blog_likes',
  {
    id: serial('id').primaryKey(),
    blogId: integer('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),

    userId: text('user_id').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.blogId, table.userId)]
)

export const userFollows = pgTable(
  'user_follows',
  {
    id: serial('id').primaryKey(),

    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    followingId: text('following_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.followerId, table.followingId)]
)

export const blogFavorites = pgTable(
  'blog_favorites',
  {
    id: serial('id').primaryKey(),
    blogId: integer('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    userId: text('user_id').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.blogId, table.userId)]
)

export const topic = pgTable('topic', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const topicFollows = pgTable(
  'topic_follows',
  {
    id: serial('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    topicId: integer('topic_id')
      .notNull()
      .references(() => topic.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.userId, table.topicId)]
)

export const blogTopics = pgTable(
  'blog_topics',
  {
    id: serial('id').primaryKey(),

    blogId: integer('blog_id')
      .notNull()
      .references(() => blogs.id, { onDelete: 'cascade' }),
    topicId: integer('topic_id')
      .notNull()
      .references(() => topic.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [unique().on(table.blogId, table.topicId)]
)

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  avatarUrl: text('avatar_url')
    .default(
      'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png'
    )
    .notNull(),
  pronouns: text('pronouns'),
  bio: text('bio'),
  role: roleEnum().notNull().default('user'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const userTopics = pgTable(
  'user_topics',
  {
    id: serial('id').primaryKey(),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    topicId: integer('topic_id')
      .notNull()
      .references(() => topic.id, { onDelete: 'cascade' }),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.userId, table.topicId)]
)

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => /* @__PURE__ */ new Date()
  ),
})

// Relationships
export const userRelations = relations(user, ({ many }) => ({
  blogs: many(blogs),
  topics: many(userTopics),
  following: many(userFollows, { relationName: 'following' }),
  followers: many(userFollows, { relationName: 'followers' }),
}))

export const blogRelations = relations(blogs, ({ one, many }) => ({
  user: one(user, {
    fields: [blogs.authorId],
    references: [user.id],
  }),
  topics: many(blogTopics),
}))

export const topicRelations = relations(topic, ({ many }) => ({
  blogs: many(blogTopics),
  follows: many(topicFollows),
}))

export const blogTopicRelations = relations(blogTopics, ({ one }) => ({
  blog: one(blogs, {
    fields: [blogTopics.blogId],
    references: [blogs.id],
  }),
  topic: one(topic, {
    fields: [blogTopics.topicId],
    references: [topic.id],
  }),
}))

export const userTopicRelations = relations(userTopics, ({ one }) => ({
  user: one(user, {
    fields: [userTopics.userId],
    references: [user.id],
  }),
  topic: one(topic, {
    fields: [userTopics.topicId],
    references: [topic.id],
  }),
}))

export const userFollowRelations = relations(userFollows, ({ one }) => ({
  follower: one(user, {
    fields: [userFollows.followerId],
    references: [user.id],
  }),
  following: one(user, {
    fields: [userFollows.followingId],
    references: [user.id],
  }),
}))

export const topicFollowRelations = relations(topicFollows, ({ one }) => ({
  user: one(user, {
    fields: [topicFollows.userId],
    references: [user.id],
  }),
  topic: one(topic, {
    fields: [topicFollows.topicId],
    references: [topic.id],
  }),
}))
