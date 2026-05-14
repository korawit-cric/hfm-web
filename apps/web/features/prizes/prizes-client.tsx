'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { prizesApi, type Prize } from '@repo/api-client';
import { Button } from '@repo/ui/button';

import { clientFetch } from '@/lib/fetch/client';

export const prizeKeys = {
  all: ['prizes'] as const,
  list: (locale: string) => [...prizeKeys.all, locale] as const,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function usePrizesQuery() {
  const locale = useLocale();
  return useQuery<Prize[]>({
    queryKey: prizeKeys.list(locale),
    queryFn: async () => {
      await delay(600);
      return clientFetch(prizesApi.list(locale));
    },
  });
}

export function PrizesClient() {
  const t = useTranslations('HomePage');
  const { data, isLoading, isFetching, error, refetch } = usePrizesQuery();

  if (isLoading) {
    return (
      <div className="border-surface rounded-xl border p-5">
        <div className="flex items-center gap-3">
          <div className="border-primary-500 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-foreground/70 text-sm">Loading prizes…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-error-400/50 rounded-xl border p-5">
        <p className="text-error-400 text-sm">Error loading prizes</p>
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
        <ul className="space-y-2 text-sm">
          {data.map((p) => (
            <li
              key={p.id}
              className="border-primary-500/30 flex flex-col rounded-lg border border-dashed px-3 py-2"
            >
              <span className="font-medium">
                {t('prizeLine', { rank: p.rank, amount: p.amount })}
              </span>
              {p.description && (
                <span className="text-foreground/70 mt-1">{p.description}</span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-foreground/70 text-sm">No prizes</p>
      )}
    </div>
  );
}
