import type { Metadata } from 'next'

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const id = params.id
  return {
    title: `Редактирование #${id}`,
    description: `Редактирование публикации #${id} на Blogging Next`,
  }
}

export default function EditBlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
