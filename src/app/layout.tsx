import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://your-blogging-app.example.com'),
  title: {
    default: 'Blogging Next App',
    template: '%s | Blogging Next',
  },
  description:
    'Платформа для чтения и создания блогов. Поиск, чтение, публикация историй и управление профилем.',
  applicationName: 'Blogging Next',
  authors: [{ name: 'Blogging Next Team' }],
  keywords: [
    'блог',
    'статьи',
    'публикации',
    'Next.js',
    'tRPC',
    'TypeScript',
  ],
  openGraph: {
    title: 'Blogging Next App',
    description:
      'Платформа для чтения и создания блогов. Поиск, чтение, публикация историй.',
    url: 'https://your-blogging-app.example.com',
    siteName: 'Blogging Next',
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blogging Next App',
    description:
      'Платформа для чтения и создания блогов. Поиск, чтение, публикация историй.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#111827',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
