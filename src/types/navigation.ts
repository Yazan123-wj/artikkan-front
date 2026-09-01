export type NavItem = {
  id: string;
  href: '/' | `/${string}`;
  labelKey: string;
};

/** Desktop header and mobile menu must share this shape. */
export type HeaderNavigation = {
  primary: readonly NavItem[];
  legal: readonly NavItem[];
  cta: NavItem;
};
