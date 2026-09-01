'use client';

type HamburgerButtonProps = {
  open: boolean;
  onToggle: () => void;
  openLabel: string;
  closeLabel: string;
};

export function HamburgerButton({
  open,
  onToggle,
  openLabel,
  closeLabel,
}: HamburgerButtonProps) {
  return (
    <button
      type="button"
      className="hamburger-button"
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? closeLabel : openLabel}
      onClick={onToggle}
    >
      <span className="hamburger-icon" aria-hidden="true">
        <span />
        <span />
      </span>
    </button>
  );
}
