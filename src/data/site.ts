export interface SiteConfig {
  name: string;
  handle: string;
  siteUrl: string;
  domain: string;
  locale: string;
  dir: 'rtl';
  role: string;
  defaultTitle: string;
  defaultDescription: string;
  hostingProvider: string;
}

export const siteConfig: SiteConfig = {
  name: 'ابوالفضل تنها',
  handle: 'abwalfdltnha178',
  siteUrl: 'https://abwalfdltnha178.ir',
  domain: 'abwalfdltnha178.ir',
  locale: 'fa_IR',
  dir: 'rtl',
  role: 'توسعه‌دهنده وب، طراح رابط کاربری و خالق محتوا',
  defaultTitle: 'ابوالفضل تنها | پورتفولیو و آزمایشگاه زنده فناوری',
  defaultDescription:
    'وب‌سایت شخصی ابوالفضل تنها (abwalfdltnha178.ir)؛ ترکیبی از پورتفولیو، آزمایشگاه زنده توسعه وب و رابط کاربری، وبلاگ Markdown و شبکه‌های اجتماعی.',
  hostingProvider: 'آروان‌کلاد',
};
