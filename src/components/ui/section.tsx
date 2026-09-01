import { cn } from '@/lib/utils';

type SectionProps = {
  as?: 'section' | 'div' | 'header' | 'footer';
  spacing?: 'none' | 'default' | 'small';
  height?: 'auto' | 'viewport';
  className?: string;
  children: React.ReactNode;
  id?: string;
  'aria-labelledby'?: string;
};

export function Section({
  as: Comp = 'section',
  spacing = 'default',
  height = 'auto',
  className,
  children,
  ...rest
}: SectionProps) {
  return (
    <Comp
      className={cn(
        spacing === 'default' && 'section-spacing',
        spacing === 'small' && 'section-spacing-small',
        height === 'viewport' && 'min-h-dvh',
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
