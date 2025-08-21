import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Мои истории',
  description: 'Управляйте своими черновиками и публикациями.',
}

export default function StoriesLayout({ children }: { children: React.ReactNode }) {
  return children
}
