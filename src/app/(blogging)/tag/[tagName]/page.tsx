'use client'

import BlogList from '@/components/BlogList'
import BlogListGrid from '@/components/BlogListGrid'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'
import { use, useState } from 'react'

const formatCompactNumber = (value?: number): string => {
  if (!value) return '0'
  try {
    return Intl.NumberFormat('en', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  } catch {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
    return String(value)
  }
}

const TagPage = ({ params }: { params: Promise<{ tagName: string }> }) => {
  const { tagName } = use(params)
  const { data: session } = authClient.useSession()
  const utils = trpc.useUtils()
  const [tempFollowing, setTempFollowing] = useState<boolean | null>(null)

  const { data: topic } = trpc.topics.getTopicByTitle.useQuery({
    title: tagName.trim(),
  })

  const { data: topicBlogs } = trpc.topics.getTopicBlogs.useQuery({
    topicId: topic?.id ?? 0,
  })

  const { data: topicStoriesCount } = trpc.topics.getTopicStoriesCount.useQuery(
    {
      topicId: topic?.id ?? 0,
    }
  )

  const { data: topicFollowersCount } =
    trpc.topics.getTopicFollowersCount.useQuery({
      topicId: topic?.id ?? 0,
    })

  const { data: isFollowing, refetch: refetchFollowState } =
    trpc.topics.getIsUserFollowing.useQuery(
      {
        userId: session?.user?.id ?? '',
        topicId: topic?.id ?? 0,
      },
      { enabled: Boolean(session?.user?.id && topic?.id) }
    )

  const { mutate: followTopic, isPending: isFollowingTopic } =
    trpc.topics.followTopic.useMutation({
      onMutate: () => {
        setTempFollowing(true)
      },
      onError: () => setTempFollowing(null),
      onSettled: async () => {
        await refetchFollowState()
        await utils.topics.getTopicFollowersCount.invalidate({
          topicId: topic?.id ?? 0,
        })
        setTempFollowing(null)
      },
    })

  const { mutate: unfollowTopic, isPending: isUnfollowingTopic } =
    trpc.topics.unfollowTopic.useMutation({
      onMutate: () => setTempFollowing(false),
      onError: () => setTempFollowing(null),
      onSettled: async () => {
        await refetchFollowState()
        await utils.topics.getTopicFollowersCount.invalidate({
          topicId: topic?.id ?? 0,
        })
        setTempFollowing(null)
      },
    })

  const displayFollowing = Boolean(tempFollowing ?? isFollowing)

  return (
    <main>
      <div className="mx-auto max-w-4xl py-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          {topic?.name ?? 'Tag not found'}
        </h1>
        <p className="mt-3 text-neutral-600">
          Topic · {formatCompactNumber(topicFollowersCount)} followers ·{' '}
          {formatCompactNumber(topicStoriesCount)}{' '}
          {Number(topicStoriesCount) === 1 ? 'story' : 'stories'}
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            variant="dark"
            disabled={
              isFollowingTopic ||
              isUnfollowingTopic ||
              !session?.user?.id ||
              !topic?.id
            }
            className={`rounded-full px-6 py-3 ${
              displayFollowing
                ? 'bg-neutral-600 hover:bg-neutral-500'
                : 'bg-black hover:bg-neutral-800'
            }`}
            onClick={() => {
              if (!session?.user?.id || !topic?.id) return
              if (displayFollowing) {
                unfollowTopic({ userId: session.user.id, topicId: topic.id })
              } else {
                followTopic({ userId: session.user.id, topicId: topic.id })
              }
            }}
          >
            {displayFollowing ? 'Following' : 'Follow'}
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-12">
        <BlogListGrid data={topicBlogs} userId={session?.user.id!} />
      </div>
    </main>
  )
}

export default TagPage
