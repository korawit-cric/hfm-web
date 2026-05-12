'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { faqsApi, type Faq } from '@repo/api-client';
import { Button } from '@repo/ui/button';

import { clientFetch } from '../../lib/fetch/client';

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
  const { data, isLoading, isFetching, error, refetch } = useFaqsQuery();

  if (isLoading) {
    return (
      <div className="border-surface rounded-xl border p-5">
        <div className="flex items-center gap-3">
          <div className="border-primary-500 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-foreground/70 text-sm">Loading FAQs…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-error-400/50 rounded-xl border p-5">
        <p className="text-error-400 text-sm">Error loading FAQs</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">TanStack Query</span>
        <Button
          onClick={() => void refetch()}
          disabled={isFetching}
          size="small"
        >
          {isFetching ? 'Refetching…' : 'Refetch'}
        </Button>
      </div>
      {data && data.length > 0 ? (
        <ul className="space-y-3 text-sm">
          {data.map((faq) => (
            <li key={faq.id} className="border-surface rounded-lg border p-3">
              <p className="font-medium">{faq.q}</p>
              <p className="text-foreground/70 mt-1">{faq.a}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-foreground/70 text-sm">No FAQs</p>
      )}
    </div>
  );
}
