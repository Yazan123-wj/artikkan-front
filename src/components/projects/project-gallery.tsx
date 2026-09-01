'use client';

import { CircularGallery } from '@/components/ui/circular-gallery';
import type { CircularGalleryItem } from '@/components/ui/circular-gallery';

type ProjectGalleryProps = {
  items: readonly CircularGalleryItem[];
  ariaLabel: string;
};

export function ProjectGallery({ items, ariaLabel }: ProjectGalleryProps) {
  if (items.length < 2) {
    return null;
  }

  return (
    <div className="project-detail-gallery-stage">
      <CircularGallery
        items={items}
        bend={3}
        textColor="#161616"
        borderRadius={0.02}
        scrollSpeed={2.2}
        scrollEase={0.05}
        autoplay
        autoplaySpeed={0.014}
        ariaLabel={ariaLabel}
      />
    </div>
  );
}
