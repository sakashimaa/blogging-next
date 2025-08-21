import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Помощь',
  description:
    'Как пользоваться Blogging Next: поиск, чтение, создание и редактирование публикаций, управление профилем.',
  openGraph: {
    title: 'Помощь — Blogging Next',
    description:
      'Руководство пользователя по платформе Blogging Next: публикации, поиск и профиль.',
  },
}

export default function Help() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <section className="rounded-xl bg-gradient-to-b from-white to-neutral-50 p-8 shadow-sm ring-1 ring-neutral-200/70">
        <h1 className="text-4xl font-extrabold tracking-tight">Помощь</h1>
        <p className="mt-4 text-neutral-700">
          Здесь вы найдёте короткое руководство по основным действиям на
          платформе.
        </p>
      </section>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Поиск и чтение</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-700">
            <li>Используйте поиск на странице «Поиск», чтобы найти публикации.</li>
            <li>Откройте запись, чтобы прочитать её целиком.</li>
            <li>Сниппет и баннер помогают понять содержание заранее.</li>
          </ul>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Создание публикации</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-700">
            <li>Перейдите в «Написать» и введите заголовок и содержание.</li>
            <li>Добавьте обложку — она улучшит внешний вид записи.</li>
            <li>Сохраните пост — он появится в ваших историях.</li>
          </ul>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Редактирование</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-700">
            <li>Откройте «Мои истории», выберите запись и нажмите «Edit draft».</li>
            <li>Меняйте текст, заголовок и обложку, затем сохраните.</li>
          </ul>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Профиль</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-neutral-700">
            <li>Откройте страницу профиля, чтобы изменить имя, аватар и био.</li>
            <li>Изменения сохраняются через модальное окно редактирования.</li>
          </ul>
        </div>
      </div>

      <section className="mt-10 rounded-lg bg-neutral-900 p-6 text-white">
        <h3 className="text-lg font-semibold">Нужна помощь?</h3>
        <p className="mt-2 text-neutral-200">
          Если возникли вопросы — опишите проблему и ожидаемое поведение.
          Поделитесь шагами воспроизведения и ссылкой на запись/профиль.
        </p>
      </section>
    </main>
  )
}
