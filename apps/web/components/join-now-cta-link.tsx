'use client';

import { Button } from '@repo/ui/button';

import { JOIN_NOW_PRIMARY_BUTTON_CLASSNAME } from '@/components/shared-classes/join-now-button-classes';

type Props = {
  href: string;
  children: React.ReactNode;
};

export function JoinNowCtaLink({ href, children }: Props) {
  return (
    <Button
      href={href}
      variant="primary"
      size="large"
      className={JOIN_NOW_PRIMARY_BUTTON_CLASSNAME}
    >
      {children}
    </Button>
  );
}
