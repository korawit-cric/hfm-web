'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { experiencesApi, type Experience } from '@repo/api-client';

import { clientFetch } from '@/lib/fetch/client';

export const experienceKeys = {
  all: ['experiences'] as const,
  list: (locale: string) => [...experienceKeys.all, locale] as const,
};

export function useExperiencesQuery() {
  const locale = useLocale();

  return useQuery<Experience[]>({
    queryKey: experienceKeys.list(locale),
    queryFn: () => clientFetch(experiencesApi.list(locale)),
  });
}
