import type { Metadata } from 'next'
import RedirectIfAuthenticated from '@/components/guards/RedirectIfAuthenticated'

export const metadata: Metadata = {
  title: 'Вход',
  description: 'Войдите в аккаунт Blogging Next, чтобы создавать и читать публикации.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <RedirectIfAuthenticated>{children}</RedirectIfAuthenticated>
}
