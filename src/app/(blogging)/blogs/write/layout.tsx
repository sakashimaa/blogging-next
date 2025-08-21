import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Написать',
  description: 'Создайте новую публикацию на Blogging Next.',
}

export default function WriteLayout({ children }: { children: React.ReactNode }) {
  return children
}
