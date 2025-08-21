import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const name = decodeURIComponent(params.username).replace(/^%40|@/, '')
  return {
    title: `@${name}`,
    description: `Профиль пользователя @${name} на Blogging Next`,
  }
}

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return children
}
