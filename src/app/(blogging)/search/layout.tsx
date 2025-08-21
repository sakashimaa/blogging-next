import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Поиск',
  description: 'Ищите публикации по ключевым словам на Blogging Next.',
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children
}
