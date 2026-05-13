'use client';

import { Toaster } from 'sonner';

/** Sonner with semantic colors (success = green icon / accents). No theme provider. */
export function SonnerToaster() {
  return <Toaster richColors />;
}
