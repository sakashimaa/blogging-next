import type { Metadata } from 'next'
import ClientLayout from './ClientLayout'

export const metadata: Metadata = {
  title: {
    default: 'Лента блогов',
    template: '%s | Blogging Next',
  },
  description:
    'Читайте и создавайте публикации на Blogging Next. Современная платформа на Next.js и tRPC.',
}

export default function BloggingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}
