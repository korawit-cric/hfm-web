/** Appends `?locale=` when `locale` is set. */
export function withLocaleQuery(path: string, locale?: string): string {
  if (!locale) {
    return path;
  }
  const q = new URLSearchParams({ locale }).toString();
  return path.includes('?') ? `${path}&${q}` : `${path}?${q}`;
}
