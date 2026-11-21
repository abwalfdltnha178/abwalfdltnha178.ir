export interface NavItem {
  label: string;
  href: string;
}

export const headerNavItems: NavItem[] = [
  { label: 'صفحه اصلی', href: '/' },
  { label: 'نمونه‌کارها', href: '/portfolio/' },
  { label: 'آزمایشگاه زنده', href: '/lab/' },
  { label: 'وبلاگ', href: '/blog/' },
  { label: 'درباره من', href: '/about/' },
];

export const footerQuickLinks: NavItem[] = [
  { label: 'صفحه اصلی', href: '/' },
  { label: 'نمونه‌کارها', href: '/portfolio/' },
  { label: 'آزمایشگاه زنده', href: '/lab/' },
  { label: 'وبلاگ', href: '/blog/' },
  { label: 'درباره من و ارتباط', href: '/about/' },
];
