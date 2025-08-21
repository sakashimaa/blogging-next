import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'О проекте',
  description:
    'Узнайте больше о Blogging Next — современной платформе для чтения и создания блогов на Next.js и tRPC.',
  openGraph: {
    title: 'О проекте — Blogging Next',
    description:
      'Цели проекта, технологии и ценности платформы для блогеров и читателей.',
  },
}

export default function About() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <section className="mb-10 rounded-xl bg-gradient-to-b from-white to-neutral-50 p-8 shadow-sm ring-1 ring-neutral-200/70">
        <h1 className="text-4xl font-extrabold tracking-tight">О проекте</h1>
        <p className="mt-4 text-lg text-neutral-700">
          Blogging Next — это минималистичная платформа для чтения и создания
          блогов. Мы фокусируемся на скорости, доступности и приятном опыте
          чтения.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Технологии</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-700">
            <li>Next.js (App Router)</li>
            <li>TypeScript</li>
            <li>tRPC и React Query</li>
            <li>Tailwind CSS</li>
          </ul>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Возможности</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-700">
            <li>Создание и редактирование постов</li>
            <li>Поиск по публикациям</li>
            <li>Просмотр профиля и историй</li>
            <li>Адаптивный интерфейс</li>
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-lg bg-neutral-900 p-6 text-white">
        <h3 className="text-lg font-semibold">Открыты к идеям</h3>
        <p className="mt-2 text-neutral-200">
          Если у вас есть предложения по улучшению — расскажите нам. Мы ценим
          обратную связь и развиваем платформу вместе с сообществом.
        </p>
      </section>
    </main>
  )
}
