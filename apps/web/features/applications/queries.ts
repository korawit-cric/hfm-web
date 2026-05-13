'use client';

import { useMutation } from '@tanstack/react-query';
import type { CreateApplicationBody } from '@repo/api-client';

import { createApplication } from './applications.service';

export function useSubmitApplicationMutation() {
  return useMutation({
    mutationFn: (body: CreateApplicationBody) => createApplication(body),
  });
}
