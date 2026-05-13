import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

export enum Locale {
  TH = 'th',
  EN = 'en',
}

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
