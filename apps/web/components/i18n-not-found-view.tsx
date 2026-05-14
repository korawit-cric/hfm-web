import { getTranslations } from 'next-intl/server';

import { Link } from '@/lib/i18n/navigation';

export async function I18nNotFoundView() {
  const t = await getTranslations('ErrorPage');

  return (
    <div className="bg-light-gray flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-secondary-500 font-sofia-sans-condensed text-6xl font-bold tracking-wide md:text-8xl">
        {t('notFoundCode')}
      </p>
      <h1 className="text-darkest-gray mt-4 text-2xl font-bold md:text-3xl">
        {t('notFoundTitle')}
      </h1>
      <p className="text-medium-gray mt-3 max-w-md text-base md:text-lg">
        {t('notFoundDescription')}
      </p>
      <Link
        href="/"
        className="border-secondary-500 text-secondary-500 hover:bg-secondary-500 mt-8 inline-flex min-h-11 items-center justify-center rounded-lg border-2 px-6 text-sm font-semibold transition-colors hover:text-white"
      >
        {t('backHome')}
      </Link>
    </div>
  );
}
