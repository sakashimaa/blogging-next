import type { Metadata } from 'next'

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const id = params.id
  return {
    title: `Запись #${id}`,
    description: `Просмотр публикации #${id} на Blogging Next`,
  }
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children
}
