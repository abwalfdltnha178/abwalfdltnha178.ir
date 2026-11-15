## 2024-05-14 - Persian RTL Foundation
**Learning:** For Persian and other RTL languages, setting the `<html lang="fa" dir="rtl">` attribute is a critical first step for accessibility and layout correctness. If this is missed, all subsequent UI components will default to LTR, causing major usability issues for native readers and screen readers.
**Action:** Always verify the core layout language and directionality before beginning any styling work on localized projects.

## 2024-05-24 - Persian Typography and System Fonts
**Learning:** Standard web-safe English fonts (like Inter, Roboto, Helvetica) do not render Persian/Arabic script elegantly or with good legibility. Defaulting to these without a proper fallback causes poor readability and degrades the UX significantly for Persian users.
**Action:** Always include a dedicated, high-quality RTL-supported font (like Vazirmatn) early in the font stack when designing for Persian language interfaces, and apply it globally.
