import { ContactRedirect } from './contact-redirect';
import { createPageMetadata } from '@/lib/metadata';

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale } = await params;
  return createPageMetadata({
    locale,
    pathname: '/contact',
    titleKey: 'contact',
  });
}

export default function ContactPage() {
  return <ContactRedirect />;
}
