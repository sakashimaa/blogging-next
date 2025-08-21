'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  BellIcon,
  HelpCircleIcon,
  InfoIcon,
  Loader2Icon,
  LogOutIcon,
  SearchIcon,
  SquarePenIcon,
  UserIcon,
  XIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Dropdown from '@/components/Dropdown'
import { authClient } from '@/lib/auth-client'
import React from 'react'

const Brand = () => (
  <Link href="/" className="flex items-center gap-2 font-serif text-2xl">
    <span className="font-black tracking-tight">Blogging</span>
  </Link>
)

const UserAvatar = ({ avatarUrl }: { avatarUrl?: string }) => {
  console.log('user avatar:', avatarUrl)
  return (
    <div className="text-white grid size-10 place-items-center rounded-full text-sm font-semibold bg-none">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        'U'
      )}
    </div>
  )
}

export default function Header() {
  const { data, isPending } = authClient.useSession()

  const router = useRouter()

  const searchParams = useSearchParams()
  const search = searchParams.get('search')

  const [query, setQuery] = React.useState<string>(search ?? '')

  React.useEffect(() => {
    setQuery(search ?? '')
  }, [search])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      router.push(`/search?search=${query ? query : ''}`)
    }
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-5 animate-spin" />
      </div>
    )
  }

  return (
    <header className="bg-white dark:bg-gray-950 sticky top-0 z-40 w-full shadow-sm isolate border-neutral-300 border-none p-2">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-4 px-4">
        <div className="flex items-center gap-3">
          <SidebarTrigger aria-label="Toggle sidebar" className="md:hidden" />
          <SidebarTrigger
            aria-label="Toggle sidebar"
            className="hidden md:inline-flex"
          />
          <Brand />
        </div>

        <div className="flex flex-1 justify-center">
          <div className="bg-background text-foreground/80 focus-within:ring-ring group relative hidden w-full max-w-xl items-center rounded-full border border-neutral-300 px-4 py-2 shadow-sm md:flex">
            <SearchIcon className="mr-3 size-4 text-foreground/60" />
            <Input
              className="placeholder:text-foreground/60 h-8 w-full border-0 p-0 shadow-none focus-visible:ring-0"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query ? (
              <button
                aria-label="Clear search"
                className="ml-2 text-foreground/60 hover:text-foreground"
                onClick={() => {
                  setQuery('')
                  router.push('/search?search=')
                }}
              >
                <XIcon className="size-4 hover:cursor-pointer" />
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            className="rounded-full border-neutral-300"
          >
            <Link href="/blogs/write">
              <SquarePenIcon className="mr-2 size-4" /> Write
            </Link>
          </Button>
          <Dropdown
            triggerContent={<UserAvatar avatarUrl={data?.user?.avatarUrl} />}
            triggerClassName="rounded-full hover:bg-transparent focus:bg-transparent"
            items={[
              {
                label: 'Profile',
                icon: <UserIcon className="mr-2 size-4" />,
                classNames: 'cursor-pointer',
                onSelect: () => {
                  router.push(`/me/profile`)
                },
                separator: true,
              },
              {
                label: 'Help',
                icon: <HelpCircleIcon className="mr-2 size-4" />,
                classNames: 'cursor-pointer',
                onSelect: () => {
                  router.push('/help')
                },
                separator: true,
              },
              {
                label: 'About',
                icon: <InfoIcon className="mr-2 size-4" />,
                classNames: 'cursor-pointer',
                onSelect: () => {
                  router.push('/about')
                },
              },
              {
                label: 'Logout',
                icon: <LogOutIcon className="mr-2 size-4" />,
                classNames: 'cursor-pointer text-red-600',
                variant: 'destructive',
                onSelect: () => {
                  authClient.signOut()
                },
              },
            ]}
          />
        </div>
      </div>
    </header>
  )
}
