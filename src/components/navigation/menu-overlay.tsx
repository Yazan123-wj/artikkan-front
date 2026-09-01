'use client';

import { forwardRef, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { FlowingMenu } from '@/components/ui/flowing-menu';
import {
  headerNavigation,
  menuPreviewImages,
} from '@/config/navigation';
import { cn } from '@/lib/utils';

type MenuOverlayProps = {
  open: boolean;
  visible: boolean;
  onNavigate: () => void;
};

export const MenuOverlay = forwardRef<HTMLDivElement, MenuOverlayProps>(
  function MenuOverlay({ open, visible, onNavigate }, ref) {
    const t = useTranslations();
    const tNav = useTranslations('nav');
    const { primary } = headerNavigation;

    const items = useMemo(
      () =>
        primary.map((item) => ({
          href: item.href,
          text: tNav(item.labelKey),
          image: menuPreviewImages[item.id],
        })),
      [primary, tNav],
    );

    return (
      <div
        ref={ref}
        id="site-menu"
        className={cn('menu-overlay', visible && 'is-open')}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu-overlay-curtain is-surface" data-menu-curtain aria-hidden="true" />
        <div className="menu-overlay-curtain is-ink" data-menu-curtain-ink aria-hidden="true" />
        <div className="menu-overlay-inner is-flowing" data-menu-flow>
          <FlowingMenu
            items={items}
            active={open}
            onNavigate={onNavigate}
            bgColor="transparent"
            aria-label={t('a11y.mainMenu')}
          />
        </div>
      </div>
    );
  },
);
