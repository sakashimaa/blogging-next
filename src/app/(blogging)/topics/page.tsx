'use client'

import TopicList from '@/components/TopicList'
import { Input } from '@/components/ui/input'
import { trpc } from '@/lib/trpc'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

type Topic =
  | {
      id: number
      name: string
      createdAt: string
      updatedAt: string
    }[]
  | undefined

const TopicsPage = () => {
  const [query, setQuery] = useState('')
  const [filteredTopics, setFilteredTopics] = useState<Topic>([])

  const { data: topics, isPending: isLoadingTopics } =
    trpc.topics.getAll.useQuery()

  useEffect(() => {
    if (topics) {
      setFilteredTopics(topics)
    }
  }, [topics])

  if (isLoadingTopics) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12">
      <h1 className="text-2xl font-bold text-center mb-6">Explore Topics</h1>
      <div className="bg-background text-foreground/80 focus-within:ring-ring group relative hidden w-full max-w-xl items-center rounded-full border border-neutral-300 px-4 py-2 shadow-sm md:flex mx-auto mb-12">
        <SearchIcon className="mr-3 size-4 text-foreground/60" />
        <Input
          className="placeholder:text-foreground/60 h-8 w-full border-0 p-0 shadow-none focus-visible:ring-0"
          placeholder="Search all topics"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setFilteredTopics(
              topics?.filter((topic) =>
                topic.name.toLowerCase().includes(e.target.value.toLowerCase())
              )
            )
          }}
        />
      </div>
      <TopicList data={filteredTopics} />
    </div>
  )
}

export default TopicsPage
