'use client';

import type { ComponentProps, MouseEvent } from 'react';
import { Link, usePathname } from '@/i18n/navigation';

type LocalizedLinkProps = ComponentProps<typeof Link>;
type IntlHref = LocalizedLinkProps['href'];

function splitStringHref(href: string): IntlHref {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) {
    return href;
  }

  const beforeHash = href.slice(0, hashIndex);
  const hash = href.slice(hashIndex + 1);
  const queryIndex = beforeHash.indexOf('?');
  const pathname =
    (queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex)) || '/';

  if (queryIndex === -1) {
    return { pathname, hash };
  }

  return {
    pathname,
    hash,
    query: Object.fromEntries(new URLSearchParams(beforeHash.slice(queryIndex + 1))),
  };
}

function resolveHref(href: IntlHref): IntlHref {
  return typeof href === 'string' ? splitStringHref(href) : href;
}

function hrefPathname(href: IntlHref): string | undefined {
  if (typeof href === 'string') {
    return href.split('#')[0]?.split('?')[0] || '/';
  }

  return href.pathname ?? undefined;
}

function hrefHash(href: IntlHref): string | undefined {
  if (typeof href === 'string') {
    const index = href.indexOf('#');
    return index === -1 ? undefined : href.slice(index + 1);
  }

  return href.hash || undefined;
}

export function LocalizedLink({
  href,
  onClick,
  scroll,
  ...props
}: LocalizedLinkProps) {
  const pathname = usePathname();
  const resolvedHref = resolveHref(href);
  const hash = hrefHash(resolvedHref);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    const targetPath = hrefPathname(resolvedHref);
    if (!hash || targetPath !== pathname) {
      return;
    }

    /* Next.js skips same-route hash clicks; scroll the section ourselves. */
    event.preventDefault();
    if (window.location.hash !== `#${hash}`) {
      window.location.hash = hash;
    } else {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  };

  return (
    <Link
      href={resolvedHref}
      scroll={scroll ?? (hash ? false : undefined)}
      onClick={handleClick}
      {...props}
    />
  );
}
