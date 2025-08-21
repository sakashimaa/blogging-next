'use client'

import BlogList from '@/components/BlogList'
import { authClient } from '@/lib/auth-client'
import { trpc } from '@/lib/trpc'

const UserLibrary = () => {
  const { data: session } = authClient.useSession()
  const userId = session?.user.id!
  const { data: favoriteBlogs } = trpc.users.getUserFavoriteBlogs.useQuery({
    userId,
  })

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-1 mt-5">
      <p className="text-2xl font-bold mb-4">Your library</p>
      <BlogList data={favoriteBlogs} userId={userId} />
    </main>
  )
}

export default UserLibrary
