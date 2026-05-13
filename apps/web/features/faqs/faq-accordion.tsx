import type { Faq } from '@repo/api-client';
import { ArrowRight } from '@repo/icons';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@repo/ui/accordion';

type Props = {
  faqs: Faq[];
  /** Initially open item (`String(faq.id)`). */
  defaultValue?: string;
};

/**
 * Opinionated FAQ layout (dark band, dividers, copy) built from `@repo/ui/accordion`.
 */
export function FaqAccordion({ faqs, defaultValue }: Props) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className="w-full border-t border-white/20"
    >
      {faqs.map((faq) => (
        <AccordionItem
          key={faq.id}
          value={String(faq.id)}
          className="border-b border-white/20"
        >
          <AccordionTrigger className="py-5 pr-1 text-base font-medium text-white md:py-6 [&[data-state=open]_svg]:-rotate-90">
            <span className="min-w-0 flex-1">{faq.q}</span>
            <ArrowRight
              className="h-4 w-4 shrink-0 rotate-90 text-white/45 transition-transform duration-200"
              aria-hidden
            />
          </AccordionTrigger>
          <AccordionContent className="text-medium-gray leading-relaxed [&>div]:pb-6 md:[&>div]:pb-7">
            <div className="whitespace-pre-line">{faq.a}</div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
