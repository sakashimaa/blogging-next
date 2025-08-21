'use client'

import { trpc } from '@/lib/trpc'
import '@/app/globals.css'
import BlogList from '@/components/BlogList'
import { authClient } from '@/lib/auth-client'

const Home = () => {
  const { data, isLoading } = trpc.blogs.allNotBlocked.useQuery()
  const { data: session } = authClient.useSession()

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-1 mt-5">
      <BlogList data={data} userId={session?.user.id!} />
    </main>
  )
}

export default Home
