import { getTranslations } from 'next-intl/server';

export const SECTION_HEADER_HEADING_CLASS =
  'font-sofia-sans-condensed mb-10 text-center text-3xl font-normal tracking-wide uppercase md:mb-20 md:text-5xl';

export type SectionHeaderNamespace =
  | 'HomePage.faq'
  | 'HomePage.showcase'
  | 'HomePage.rankingSection';

type Props = {
  id: string;
  namespace: SectionHeaderNamespace;
  translationKey: string;
};

export async function SectionHeader({ id, namespace, translationKey }: Props) {
  const t = await getTranslations(namespace);
  return (
    <h2 id={id} className={SECTION_HEADER_HEADING_CLASS}>
      {t(translationKey)}
    </h2>
  );
}
