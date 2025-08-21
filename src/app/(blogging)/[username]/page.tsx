'use client'

import BlogCardForProfile from '@/components/BlogCardForProfile'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

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

const Profile = () => {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const utils = trpc.useUtils()

  const rawUsername = Array.isArray(params?.username)
    ? params?.username?.[0] ?? ''
    : params?.username ?? ''
  const profileName = decodeURIComponent(rawUsername).replaceAll('@', '')

  const {
    data: userFollowings,
    isPending: isLoadingUserFollowings,
    refetch: refetchFollowings,
  } = trpc.follow.getUserFollowing.useQuery(
    { followerId: session?.user?.id as string },
    { enabled: Boolean(session?.user?.id) }
  )

  const [showBurst, setShowBurst] = useState(false)
  const [tempFollowing, setTempFollowing] = useState<boolean | null>(null)

  const { mutate: followUser, isPending: isFollowingPending } =
    trpc.follow.followUser.useMutation({
      onMutate: () => {
        setTempFollowing(true)
        setShowBurst(true)
      },
      onError: () => {
        setTempFollowing(null)
      },
      onSettled: async () => {
        await refetchFollowings()
        setTimeout(() => {
          setTempFollowing(null)
          setShowBurst(false)
        }, 400)
        utils.follow.getUserFollowers.invalidate()
      },
    })

  const { mutate: unfollowUser, isPending: isUnfollowingPending } =
    trpc.follow.unfollowUser.useMutation({
      onMutate: () => {
        setTempFollowing(false)
      },
      onError: () => {
        setTempFollowing(null)
      },
      onSettled: async () => {
        await refetchFollowings()
        setTimeout(() => setTempFollowing(null), 200)
      },
      onSuccess: () => {
        utils.follow.getUserFollowers.invalidate()
      },
    })

  const { data: profile } = trpc.users.byUsername.useQuery(
    { username: profileName },
    { enabled: profileName.length > 0 }
  )

  const { data: blogs, isPending: isLoadingBlogs } =
    trpc.users.userBlogs.useQuery(
      { authorId: profile?.id as string },
      { enabled: Boolean(profile?.id) }
    )

  const { data: userFavorites, isPending: isLoadingUserFavorites } =
    trpc.users.getUserFavorites.useQuery(
      { userId: session?.user?.id as string },
      { enabled: Boolean(session?.user?.id) }
    )

  const { data: userLikes, isPending: isLoadingUserLikes } =
    trpc.users.getUserLikes.useQuery(
      { userId: session?.user?.id as string },
      { enabled: Boolean(session?.user?.id) }
    )

  const { data: userFollowers, isPending: isLoadingUserFollowers } =
    trpc.follow.getUserFollowers.useQuery(
      { userId: profile?.id as string },
      { enabled: Boolean(profile?.id) }
    )

  useEffect(() => {
    if (session?.user?.id && profile?.id && session.user.id === profile.id) {
      router.replace('/me/profile')
    }
  }, [router, session?.user?.id, profile?.id])

  if (!session?.user?.id) {
    return <div>Not logged in</div>
  }

  if (!profile) {
    return <div>Profile not found</div>
  }

  if (
    isLoadingBlogs ||
    isLoadingUserFavorites ||
    isLoadingUserLikes ||
    isLoadingUserFollowings ||
    isLoadingUserFollowers
  ) {
    return <div>Loading...</div>
  }

  const isFollowing = userFollowings?.some(
    (following) => following.followingId === profile.id
  )
  const displayFollowing = (tempFollowing ?? isFollowing) as boolean

  const handleFollow = () => {
    followUser({
      followerId: session?.user?.id as string,
      followingId: profile.id,
    })
  }

  const handleUnfollow = () => {
    unfollowUser({
      followerId: session?.user?.id as string,
      followingId: profile.id,
    })
  }

  return (
    <main>
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-extrabold tracking-tight">
          {profile?.name}
        </h1>

        <Tabs className="mt-4" defaultValue="home">
          <TabsList className="p-0">
            <TabsTrigger value="home" className="mr-2">
              Home
            </TabsTrigger>
            <TabsTrigger value="about" className="mr-2">
              About
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <section className="lg:col-span-8 xl:col-span-9">
              <TabsContent value="home" className="mt-0">
                {blogs?.map((blog) => (
                  <BlogCardForProfile
                    key={blog.id ?? undefined}
                    blog={blog}
                    userFavorites={userFavorites}
                    userLikes={userLikes}
                    userId={session?.user?.id as string}
                  />
                ))}
              </TabsContent>

              <TabsContent value="about" className="mt-0">
                <div className="prose max-w-none text-neutral-700">
                  <p>{profile?.bio || 'No bio provided.'}</p>
                </div>
              </TabsContent>
            </section>

            <aside className="lg:col-span-4 xl:col-span-3 lg:border-l lg:border-neutral-200 lg:pl-8">
              <div className="sticky top-6">
                <div className="rounded-xl p-6 bg-white shadow-sm">
                  <div className="flex flex-col items-start gap-4">
                    {profile?.authorImageUrl ? (
                      <div className="h-24 w-24 rounded-full">
                        <img
                          src={profile.authorImageUrl}
                          alt={profile?.name || 'Avatar'}
                          className="h-full w-full rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      </div>
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-neutral-200" />
                    )}
                    <div className="space-y-1">
                      <div className="text-base font-semibold">
                        {profile?.name}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {formatCompactNumber(userFollowers?.length)} followers
                      </div>
                      {profile?.pronouns ? (
                        <div className="text-sm text-neutral-500">
                          {profile.pronouns}
                        </div>
                      ) : null}
                    </div>
                    {profile?.bio ? (
                      <p className="text-sm text-neutral-600">{profile.bio}</p>
                    ) : null}
                    <div className="relative">
                      {showBurst ? (
                        <span className="pointer-events-none absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                      ) : null}
                      <Button
                        variant="dark"
                        disabled={isFollowingPending || isUnfollowingPending}
                        className={`rounded-full hover:opacity-90 cursor-pointer transition-all duration-300 py-2 px-5 relative flex items-center gap-2 shadow-sm
                          ${
                            displayFollowing
                              ? 'bg-neutral-600 hover:bg-neutral-500'
                              : 'bg-black hover:bg-neutral-800'
                          }`}
                        onClick={() => {
                          if (displayFollowing) {
                            unfollowUser({
                              followerId: session?.user?.id as string,
                              followingId: profile.id,
                            })
                            return
                          }
                          handleFollow()
                          setTimeout(() => setShowBurst(false), 600)
                        }}
                      >
                        <span className={`transition-transform duration-200`}>
                          {displayFollowing ? 'Following' : 'Follow'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Tabs>
      </div>
    </main>
  )
}

export default Profile
