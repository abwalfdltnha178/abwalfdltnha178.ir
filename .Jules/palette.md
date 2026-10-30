## 2024-10-30 - Accessible Interactive Elements in Astro
**Learning:** Found that default Astro starter templates often lack `aria-hidden` on decorative SVGs inside links and lack clear `:focus-visible` styles, which hinders keyboard accessibility and screen reader experience.
**Action:** Always add `aria-hidden="true"` and `focusable="false"` to decorative SVGs, and ensure robust `:focus-visible` states are implemented for all interactive elements in new Astro pages.
