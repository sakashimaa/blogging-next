import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Профиль',
  description: 'Просмотр и редактирование профиля пользователя.',
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
