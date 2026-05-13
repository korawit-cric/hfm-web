import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

export enum Locale {
  TH = 'th',
  EN = 'en',
}

export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
