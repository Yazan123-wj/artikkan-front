import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';

type SectionPlaceholderProps = {
  title: string;
};

export function SectionPlaceholder({ title }: SectionPlaceholderProps) {
  const t = useTranslations('placeholder');

  return (
    <Section>
      <Container>
        <h1 className="type-h1">{title}</h1>
        <p className="type-body mt-4">{t('sectionUnderDevelopment')}</p>
        <p className="type-label mt-6 text-muted-foreground">
          {t('comingSoon')}
        </p>
      </Container>
    </Section>
  );
}
