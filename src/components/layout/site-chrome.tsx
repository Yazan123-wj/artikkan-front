'use client';

import type { ReactNode } from 'react';
import { LogoDockProvider } from '@/components/navigation/logo-dock-context';
import { SiteHeader } from '@/components/navigation/site-header';
import { MusicControl } from '@/components/layout/music-control';
import { SiteFooter } from '@/components/layout/site-footer';
import { LoadingScreen } from '@/components/motion/loading-screen';
import { PageTransition } from '@/components/motion/page-transition';
import { ScrollOrigin } from '@/components/layout/scroll-origin';
import { usePathname } from '@/i18n/navigation';
import { MAIN_CONTENT_ID } from '@/lib/constants';
import { cn } from '@/lib/utils';

type SiteChromeProps = {
  children: ReactNode;
};

export function SiteChrome({ children }: SiteChromeProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <LogoDockProvider>
      <ScrollOrigin />
      <LoadingScreen />
      <SiteHeader isHome={isHome} />
      <main
        id={MAIN_CONTENT_ID}
        className={cn(isHome ? 'is-home' : 'has-header-offset')}
        tabIndex={-1}
      >
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter />
      <MusicControl />
    </LogoDockProvider>
  );
}
