'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { faqsApi, type Faq } from '@repo/api-client';

import { clientFetch } from '@/lib/fetch/client';

import { FaqAccordion } from './faq-accordion';

export const faqKeys = {
  all: ['faqs'] as const,
  list: (locale: string) => [...faqKeys.all, locale] as const,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useFaqsQuery() {
  const locale = useLocale();
  return useQuery<Faq[]>({
    queryKey: faqKeys.list(locale),
    queryFn: async () => {
      await delay(600);
      return clientFetch(faqsApi.list(locale));
    },
  });
}

export function FaqsClient() {
  const t = useTranslations('HomePage');
  const { data, isLoading, error } = useFaqsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-6">
        <div
          className="h-5 w-5 animate-spin rounded-full border-2 border-white/25 border-t-white"
          aria-hidden
        />
        <p className="text-medium-gray text-sm">{t('faqAccordionLoading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-error-400 text-sm" role="alert">
        {t('faqAccordionError')}
      </p>
    );
  }

  if (data && data.length > 0) {
    return <FaqAccordion faqs={data} />;
  }

  return <p className="text-medium-gray text-sm">{t('noFaqs')}</p>;
}
