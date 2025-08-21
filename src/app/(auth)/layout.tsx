import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Авторизация',
    template: '%s | Blogging Next',
  },
  description: 'Вход и регистрация пользователей на платформе Blogging Next.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="pt-14 mb-3">{children}</main>
}
