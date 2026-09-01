import { cn } from '@/lib/utils';

const widths = {
  full: 'container-full',
  wide: 'site-container',
  standard: 'site-container',
  narrow: 'container-narrow',
} as const;

type ContainerProps = {
  as?: 'div' | 'article' | 'aside';
  width?: keyof typeof widths;
  className?: string;
  children: React.ReactNode;
};

export function Container({
  as: Comp = 'div',
  width = 'standard',
  className,
  children,
}: ContainerProps) {
  return <Comp className={cn(widths[width], className)}>{children}</Comp>;
}
