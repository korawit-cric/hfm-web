import { Link } from '@/lib/i18n/navigation';

export type NavigationBarMainNavItem = {
  href: string;
  label: string;
};

type Props = {
  items: NavigationBarMainNavItem[];
  navAriaLabel: string;
};

export function NavigationBarMainNav({ items, navAriaLabel }: Props) {
  return (
    <nav
      aria-label={navAriaLabel}
      className="text-lightest-gray hidden items-center gap-9 text-base font-normal lg:flex"
    >
      {items.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className="transition-colors hover:text-white! hover:underline!"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
