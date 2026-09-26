'use client';

import { LocalizedLink } from '@/components/shared/localized-link';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types/navigation';

export type FlowingMenuItem = {
  href: NavItem['href'];
  text: string;
};

type FlowingMenuProps = {
  items: readonly FlowingMenuItem[];
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  active?: boolean;
  onNavigate?: () => void;
  className?: string;
  'aria-label'?: string;
};

export function FlowingMenu({
  items = [],
  textColor = '#161616',
  bgColor = '#f6f4f0',
  borderColor = 'rgb(22 22 22 / 0.14)',
  active = true,
  onNavigate,
  className,
  'aria-label': ariaLabel,
}: FlowingMenuProps) {
  return (
    <div
      className={cn('flowing-menu', className)}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <nav className="flowing-menu__nav" aria-label={ariaLabel}>
        {items.map((item) => (
          <div
            key={`${item.href}-${item.text}`}
            className="flowing-menu__item"
            style={{ borderColor }}
          >
            <LocalizedLink
              href={item.href}
              className="flowing-menu__link"
              tabIndex={active ? undefined : -1}
              onClick={onNavigate}
            >
              {item.text}
            </LocalizedLink>
          </div>
        ))}
      </nav>
    </div>
  );
}
