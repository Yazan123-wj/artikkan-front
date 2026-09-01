type VisuallyHiddenProps = {
  as?: 'span' | 'h1' | 'h2';
  children: React.ReactNode;
};

export function VisuallyHidden({
  as: Comp = 'span',
  children,
}: VisuallyHiddenProps) {
  return <Comp className="sr-only">{children}</Comp>;
}
