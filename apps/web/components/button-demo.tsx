'use client';

import { Button } from '@repo/ui/button';

/**
 * Button Demo Component
 * Client component to demonstrate button interactions
 */
export function ButtonDemo() {
  return (
    <section className="border-surface mt-8 border-t pt-8">
      <h2 className="mb-4 text-xl font-semibold">Button</h2>
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => alert('Clicked!')} variant="primary">
          Click me
        </Button>
        <Button disabled variant="primary" size="small">
          Disabled
        </Button>
        <Button variant="secondary" size="small">
          Custom Style
        </Button>
      </div>
    </section>
  );
}
