'use client'

import { capitalize } from '@/utils/funcs'
import Link from 'next/link'

type Props = {
  data:
    | {
        id: number
        name: string
        createdAt: string
        updatedAt: string
      }[]
    | undefined
}

const TopicList = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-4 gap-6">
      {data?.map((topic) => (
        <Link
          key={topic.id}
          href={`/tag/${topic.name}`}
          className="bg-neutral-100 rounded-lg p-4"
        >
          {capitalize(topic.name)}
        </Link>
      ))}
    </div>
  )
}

export default TopicList
