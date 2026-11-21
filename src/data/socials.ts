export interface SocialLinkItem {
  id: string;
  label: string;
  url: string;
  group: 'code-web' | 'social' | 'channel-video';
}

export const socialLinks: SocialLinkItem[] = [
  {
    id: 'github',
    label: 'گیت‌هاب',
    url: 'https://github.com/abwalfdltnha178',
    group: 'code-web',
  },
  {
    id: 'github-pages',
    label: 'سایت گیت‌هاب پیجز',
    url: 'https://abwalfdltnha178.github.io',
    group: 'code-web',
  },
  {
    id: 'linkedin',
    label: 'لینکدین',
    url: 'https://www.linkedin.com/in/abwalfdltnha178',
    group: 'social',
  },
  {
    id: 'instagram',
    label: 'اینستاگرام',
    url: 'https://instagram.com/abwalfdltnha',
    group: 'social',
  },
  {
    id: 'telegram-personal',
    label: 'تلگرام شخصی',
    url: 'https://t.me/abwalfdltnha178',
    group: 'social',
  },
  {
    id: 'telegram-channel',
    label: 'کانال تلگرام',
    url: 'https://t.me/weblog_telegram',
    group: 'channel-video',
  },
  {
    id: 'youtube',
    label: 'کانال یوتیوب',
    url: 'https://www.youtube.com/@abwalfdltnha178',
    group: 'channel-video',
  },
  {
    id: 'aparat',
    label: 'آپارات',
    url: 'https://www.aparat.com/abwalfdltnha',
    group: 'channel-video',
  },
  {
    id: 'x',
    label: 'ایکس (X)',
    url: 'https://x.com/abwalfdltnha178',
    group: 'social',
  },
  {
    id: 'virasty',
    label: 'ویراستی',
    url: 'https://virasty.com/abwalfdltnha178',
    group: 'social',
  },
  {
    id: 'facebook',
    label: 'فیس‌بوک',
    url: 'https://www.facebook.com/abwalfdltnha178',
    group: 'social',
  },
  {
    id: 'pinterest',
    label: 'پینترست',
    url: 'https://www.pinterest.com/abwalfdltnha178',
    group: 'social',
  },
];
