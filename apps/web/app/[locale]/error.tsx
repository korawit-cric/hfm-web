'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { Link } from '@/lib/i18n/navigation';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorBoundary({ error, reset }: Props) {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-light-gray flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-darkest-gray text-2xl font-bold md:text-3xl">
        {t('errorTitle')}
      </h1>
      <p className="text-medium-gray mt-3 max-w-md text-base md:text-lg">
        {t('errorDescription')}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="bg-secondary-500 hover:bg-secondary-700 inline-flex min-h-11 items-center justify-center rounded-lg px-6 text-sm font-semibold text-white transition-colors"
        >
          {t('tryAgain')}
        </button>
        <Link
          href="/"
          className="border-secondary-500 text-secondary-500 hover:bg-secondary-500 inline-flex min-h-11 items-center justify-center rounded-lg border-2 px-6 text-sm font-semibold transition-colors hover:text-white"
        >
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
