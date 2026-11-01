## 2026-11-01 - Added Keyboard Focus States and ARIA attributes
**Learning:** The default Astro template lacks clear visual indicators for keyboard navigation and leaves decorative SVGs exposed to screen readers. Adding `:focus-visible` and `aria-hidden` significantly improves baseline accessibility.
**Action:** Always check interactive elements for visible focus states and hide purely decorative SVG elements from screen readers in Astro components.
