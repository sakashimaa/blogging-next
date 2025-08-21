'use client'

import BlogList from '@/components/BlogList'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'

const FollowingFeedPage = () => {
  const { data: session } = authClient.useSession()

  const { data: followingBlogs, isPending: isLoadingFollowingBlogs } =
    trpc.users.getUserFollowingBlogs.useQuery({
      userId: session?.user.id ?? '',
    })

  if (isLoadingFollowingBlogs) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12">
      {followingBlogs ? (
        <BlogList data={followingBlogs} userId={session?.user.id ?? ''} />
      ) : (
        <div>No following blogs</div>
      )}
    </div>
  )
}

export default FollowingFeedPage
