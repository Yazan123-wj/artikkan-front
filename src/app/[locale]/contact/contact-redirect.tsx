'use client';

import { useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';

export function ContactRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/#contact');
  }, [router]);

  return null;
}
