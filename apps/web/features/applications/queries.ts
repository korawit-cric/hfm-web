'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  applicationsApi,
  type CreateApplicationBody,
  type SavedApplication,
} from '@repo/api-client';

import { clientFetch } from '@/lib/fetch/client';

import { createApplication } from './applications.service';

export const applicationKeys = {
  all: ['applications'] as const,
  list: () => [...applicationKeys.all, 'list'] as const,
  detail: (id: number) => [...applicationKeys.all, 'detail', id] as const,
};

export function useApplicationsQuery() {
  return useQuery<SavedApplication[]>({
    queryKey: applicationKeys.list(),
    queryFn: () => clientFetch(applicationsApi.list()),
  });
}

const applicationDetailIdleKey = [
  ...applicationKeys.all,
  'detail',
  'idle',
] as const;

export function useApplicationQuery(id: number | null) {
  const enabled = id !== null && Number.isInteger(id) && id >= 1;
  return useQuery<SavedApplication>({
    queryKey: enabled ? applicationKeys.detail(id) : applicationDetailIdleKey,
    queryFn: () => clientFetch(applicationsApi.getById(id!)),
    enabled,
  });
}

export function useSubmitApplicationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateApplicationBody) => createApplication(body),
    onSuccess: (result) => {
      if (result.ok) {
        void queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      }
    },
  });
}
