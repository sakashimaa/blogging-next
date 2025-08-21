'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function RedirectIfAuthenticated({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace('/')
    }
  }, [isPending, session?.user, router])

  if (isPending) return null
  if (session?.user) return null

  return <>{children}</>
}
