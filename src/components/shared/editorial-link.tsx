import type { ComponentProps, ReactNode } from 'react';
import { LocalizedLink } from '@/components/shared/localized-link';
import { cn } from '@/lib/utils';

type EditorialLinkProps = {
  href: ComponentProps<typeof LocalizedLink>['href'];
  children: ReactNode;
  className?: string;
  arrow?: boolean;
  back?: boolean;
} & Omit<ComponentProps<typeof LocalizedLink>, 'href' | 'children' | 'className'>;

export function EditorialLink({
  href,
  children,
  className,
  arrow = true,
  back = false,
  ...props
}: EditorialLinkProps) {
  return (
    <LocalizedLink
      href={href}
      className={cn('editorial-link touch-target', back && 'is-back', className)}
      {...props}
    >
      <span className="editorial-link-label">{children}</span>
      {arrow ? (
        <span className="editorial-link-arrow" aria-hidden="true">
          <svg viewBox="0 0 28 12" fill="none">
            <path d="M0 6h26M21.5 1.5 27 6l-5.5 4.5" />
          </svg>
        </span>
      ) : null}
    </LocalizedLink>
  );
}
