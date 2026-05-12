'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { rankingsApi, type Ranking } from '@repo/api-client';
import { Button } from '@repo/ui/button';

import { clientFetch } from '../../lib/fetch/client';

export const rankingKeys = {
  all: ['rankings'] as const,
  list: (locale: string) => [...rankingKeys.all, locale] as const,
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function useRankingsQuery() {
  const locale = useLocale();
  return useQuery<Ranking[]>({
    queryKey: rankingKeys.list(locale),
    queryFn: async () => {
      await delay(600);
      return clientFetch(rankingsApi.list(locale));
    },
  });
}

export function RankingsClient() {
  const { data, isLoading, isFetching, error, refetch } = useRankingsQuery();

  if (isLoading) {
    return (
      <div className="border-surface rounded-xl border p-5">
        <div className="flex items-center gap-3">
          <div className="border-primary-500 h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-foreground/70 text-sm">Loading rankings…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-error-400/50 rounded-xl border p-5">
        <p className="text-error-400 text-sm">Error loading rankings</p>
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
          {data.map((r) => (
            <li
              key={r.id}
              className="border-primary-500/30 flex justify-between rounded-lg border border-dashed px-3 py-2"
            >
              <span className="font-medium">
                #{r.rank} {r.name}
              </span>
              <span className="text-foreground/60">{r.gain}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-foreground/70 text-sm">No rankings</p>
      )}
    </div>
  );
}
