## 2025-02-12 - Missing ARIA Labels on Decorative Icons
**Learning:** The default Astro template (`Welcome.astro`) lacks `aria-hidden="true"` on decorative icons, which causes screen readers to misinterpret them or read unnecessary noise. Note: Global `:focus-visible` CSS was considered but rejected because of strict rules against adding custom CSS.
**Action:** Always ensure all purely decorative SVGs have `aria-hidden="true"` so screen readers don't misinterpret them.
