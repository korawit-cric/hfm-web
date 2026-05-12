'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import {
  linksApi,
  type CreateLinkDto,
  type UpdateLinkDto,
  type Link,
} from '@repo/api-client';
import { clientFetch } from '../../lib/fetch/client';

export const linkKeys = {
  all: ['links'] as const,
  list: (locale: string) => [...linkKeys.all, locale] as const,
  detail: (id: number, locale: string) =>
    ['links', 'detail', id, locale] as const,
};

/**
 * Helper to add a delay to async operations
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Hook to fetch all links (client-side with TanStack Query)
 */
export function useLinksQuery() {
  const locale = useLocale();

  return useQuery<Link[]>({
    queryKey: linkKeys.list(locale),
    queryFn: async () => {
      await delay(800);
      return clientFetch(linksApi.list(locale));
    },
  });
}

/**
 * Hook to fetch a single link
 */
export function useLinkQuery(id: number) {
  const locale = useLocale();

  return useQuery<Link>({
    queryKey: linkKeys.detail(id, locale),
    queryFn: async () => {
      await delay(600);
      return clientFetch(linksApi.detail(id, locale));
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new link
 */
export function useCreateLinkMutation() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (data: CreateLinkDto) => clientFetch(linksApi.create(data)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: linkKeys.all });
      void queryClient.invalidateQueries({ queryKey: linkKeys.list(locale) });
    },
  });
}

/**
 * Hook to update a link
 */
export function useUpdateLinkMutation() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLinkDto }) =>
      clientFetch(linksApi.update(id, data, locale)),
    onSuccess: (_, { id }) => {
      void queryClient.invalidateQueries({ queryKey: linkKeys.all });
      void queryClient.invalidateQueries({
        queryKey: linkKeys.detail(id, locale),
      });
      void queryClient.invalidateQueries({ queryKey: linkKeys.list(locale) });
    },
  });
}

/**
 * Hook to delete a link
 */
export function useDeleteLinkMutation() {
  const queryClient = useQueryClient();
  const locale = useLocale();

  return useMutation({
    mutationFn: (id: number) => clientFetch(linksApi.delete(id)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: linkKeys.all });
      void queryClient.invalidateQueries({ queryKey: linkKeys.list(locale) });
    },
  });
}
