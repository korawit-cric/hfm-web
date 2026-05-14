# HFM Web (`hfm-frontend`)

Next.js app in the **hfm-web** monorepo (`apps/web`).

## Getting Started

From the repo root:

```bash
npm run dev --filter=hfm-frontend
```

Open [http://localhost:3000](http://localhost:3000) (default locale `en`, no prefix). Thai: [http://localhost:3000/th](http://localhost:3000/th).

Routing uses **next-intl** with `localePrefix: 'as-needed'` ([docs](https://next-intl.dev/docs/routing)). Use `Link` / `redirect` / `useRouter` from `lib/i18n/navigation` so locale is preserved.

Messages live in `messages/{locale}.json` (`en`, `th`). The root layout loads **Prompt** from Google Fonts via [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts).

## Learn More

- [Next.js documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js on GitHub](https://github.com/vercel/next.js)

## Deploy

Use the [Vercel Platform](https://vercel.com/new) or see [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying).
