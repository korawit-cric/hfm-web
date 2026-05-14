'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import { countriesApi, type Country } from '@repo/api-client';

import { clientFetch } from '@/lib/fetch/client';

export const countryKeys = {
  all: ['countries'] as const,
  list: (locale: string) => [...countryKeys.all, locale] as const,
};

export function useCountriesQuery() {
  const locale = useLocale();

  return useQuery<Country[]>({
    queryKey: countryKeys.list(locale),
    queryFn: () => clientFetch(countriesApi.list(locale)),
  });
}
