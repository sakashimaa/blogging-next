import type { Metadata } from 'next'
import RedirectIfAuthenticated from '@/components/guards/RedirectIfAuthenticated'

export const metadata: Metadata = {
  title: 'Регистрация',
  description: 'Создайте аккаунт Blogging Next и начните публиковать свои истории.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
}
