import type { Faq } from '@repo/api-client';

import { FaqAccordion } from '@/features/faqs/faq-accordion';

type Props = {
  faqs: Faq[];
  title: string;
  emptyLabel: string;
};

export function FaqSection({ faqs, title, emptyLabel }: Props) {
  return (
    <section
      className="bg-black text-white"
      aria-labelledby="faq-section-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <h2
          id="faq-section-heading"
          className="mb-8 text-xl font-semibold tracking-tight text-white md:mb-10 md:text-2xl"
        >
          {title}
        </h2>
        {faqs.length > 0 ? (
          <FaqAccordion faqs={faqs} />
        ) : (
          <p className="text-medium-gray text-sm">{emptyLabel}</p>
        )}
      </div>
    </section>
  );
}
