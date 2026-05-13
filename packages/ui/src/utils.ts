import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge: register design-system utilities that collide with built-in `text-*` groups.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'text-color': [{ text: ['gold-gradient'] }],
    },
  },
});

/**
 * Merge class names with Tailwind conflict resolution (`cn` from shadcn pattern).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
