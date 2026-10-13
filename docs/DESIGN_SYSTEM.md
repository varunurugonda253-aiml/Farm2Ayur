# 🎨 Farm2Ayur — Design System Specification

> **"From Soil to Synergy"** — Visual design tokens, component architecture, color palettes, typography, responsive layouts, and accessibility specifications for the Farm2Ayur platform.

---

### 📋 System Metadata

![Stage](https://img.shields.io/badge/Stage-Prototype-yellow?style=for-the-badge&logo=rocket)
![Stack](https://img.shields.io/badge/Stack-Vite%20%7C%20HTML5%20%7C%20CSS3%20%7C%20ES%20Modules-646CFF?style=for-the-badge&logo=vite)
![Theme](https://img.shields.io/badge/Theme-Botanical%20Emerald%20%26%20Warm%20Neutrals-10B981?style=for-the-badge&logo=leaf)
![Status](https://img.shields.io/badge/Status-Partial%20Implementation-orange?style=for-the-badge)

| Attribute | Details | Attribute | Details |
| :--- | :--- | :--- | :--- |
| **Project Name** | **Farm2Ayur** | **Current Stage** | 🟡 Active Prototype |
| **Design Framework** | Vite · HTML5 · CSS3 · JavaScript ES Modules | **Design Approach** | Botanical Emerald, Warm Neutrals, Page-Specific Styling |
| **Main Typography** | Outfit · Lora | **Additional Typography** | Plus Jakarta Sans · Cinzel · Montserrat · Bebas Neue |
| **Main Palette** | Emerald · Warm Ivory · Slate | **Target Viewports** | Mobile · Tablet · Desktop |
| **Interactive Preview** | [`docs/design-preview.html`](./design-preview.html) | **Implementation Status** | Partially Implemented; Consistency and Accessibility Require Validation |

> 💡 **Interactive Visual Showcase:** Open [`docs/design-preview.html`](./design-preview.html) in a modern browser to view the reference color swatches, typography specimens, and UI components. Its styles are embedded in the preview file, so it is a visual reference rather than a live connection to the application's CSS tokens.

---

## 1. Design Overview

Farm2Ayur combines Ayurvedic botanical heritage with a modern agricultural technology aesthetic. Its visual identity uses botanical emerald accents, warm light surfaces, typography-led headings, glass-like panels, and interactive motion.

The implementation currently has several related but distinct visual themes:

- **Main website:** Warm ivory backgrounds, emerald accents, dark navigation, and Outfit/Lora typography.
- **Scanner interface:** Emerald HUD elements, rounded camera containers, focus indicators, and camera-related motion.
- **Login interface:** Dark translucent panels, Cinzel headings, and gold action buttons.
- **About page:** Light botanical surfaces, emerald and cyan accents, Montserrat body text, and distinctive display typography.

These themes share a botanical visual language, but their CSS tokens and components are not yet fully centralized.

### Core Design Principles

- 🌿 **Botanical Color Identity:** Emerald green provides the primary brand accent, supported by warm ivory, white, dark slate, and selective cyan or gold highlights.
- 🧊 **Layered Surfaces:** Translucent panels, subtle borders, shadows, and blur effects are used in selected components rather than universally.
- ✍️ **Editorial Typography:** Sans-serif typography supports interface readability, while serif and display fonts provide heritage and visual distinction.
- ⚡ **Interactive Feedback:** Hover transitions, scanner HUD animations, cursor effects, and modal transitions improve interface feedback.
- 📱 **Responsive Layouts:** Page-specific media queries adapt navigation, card layouts, and scanner controls to smaller viewports.
- ♿ **Accessible Interaction:** Keyboard focus styles, ARIA attributes, and reduced-motion rules are present in selected components and need broader validation.

### CSS Loading and Cascade

The main website loads:

- `assets/css/style.css`
- `assets/css/components.css`
- `assets/css/overrides.css`
- `assets/css/footer.css`
- `assets/css/traceability.css`

The scanner, login, and about pages use different stylesheet combinations. Some selectors, such as `.btn-primary`, are defined differently across these files.

**Important:** A token or component value documented in one stylesheet should not be assumed to apply globally. The final appearance depends on the page, CSS import order, selector specificity, and later overrides.

---

## 2. Color Palette

The following values are taken from the current CSS files. They are grouped by their actual implementation scope rather than presented as one universal palette.

### 2.1 Shared Brand and Main Website Colors

| Swatch | Color Name | HEX / RGBA Value | CSS Token / Location | Role |
| :---: | :--- | :--- | :--- | :--- |
| ![#059669](https://img.shields.io/badge/%20%20-059669?style=for-the-badge&color=059669) | **Primary Emerald** | `#059669` | `--primary-green` in `assets/css/style.css` | Main-site brand accent and interactive elements |
| ![#10B981](https://img.shields.io/badge/%20%20-10B981?style=for-the-badge&color=10B981) | **Emerald Green** | `#10b981` | `--secondary-green`; also used in overrides | Accent states, borders, glows, and highlights |
| ![#065F46](https://img.shields.io/badge/%20%20-065F46?style=for-the-badge&color=065F46) | **Deep Green** | `#065f46` | `--light-sage` in main CSS | Dark-green accents and botanical styling |
| ![#D97706](https://img.shields.io/badge/%20%20-D97706?style=for-the-badge&color=D97706) | **Warm Amber** | `#d97706` | `--gold-accent` | Main stylesheet's warm accent color |
| ![#0284C7](https://img.shields.io/badge/%20%20-0284C7?style=for-the-badge&color=0284C7) | **Blue-Cyan Accent** | `#0284c7` | `--cyan-accent` in main CSS | Secondary accent and interactive borders |
| ![#FAF3E2](https://img.shields.io/badge/%20%20-FAF3E2?style=for-the-badge&color=FAF3E2) | **Warm Ivory** | `#FAF3E2` | `--bg-dark`, `--bg-card` overrides | Main page and scanner light backgrounds |
| ![#0F172A](https://img.shields.io/badge/%20%20-0F172A?style=for-the-badge&color=0F172A) | **Slate Text** | `#0f172a` | `--text-light` in main CSS | Primary dark text on light surfaces |
| ![#475569](https://img.shields.io/badge/%20%20-475569?style=for-the-badge&color=475569) | **Muted Slate** | `#475569` | `--text-muted` in main CSS | Supporting text and descriptions |
| ![#FFFFFF](https://img.shields.io/badge/%20%20-FFFFFF?style=for-the-badge&color=FFFFFF) | **White Surface** | `#ffffff` | Component-specific values | Cards, scanner panels, and light surfaces |

### 2.2 Scanner Palette

The dedicated `scan.css` stylesheet defines the following additional tokens:

| Color Name | HEX / RGBA Value | CSS Token | Role |
| :--- | :--- | :--- | :--- |
| **Primary Emerald** | `#10b981` | `--emerald-primary` | Scanner controls, focus indicators, and reticle |
| **Emerald Light** | `#34d399` | `--emerald-light` | HUD highlights |
| **Emerald Dark** | `#047857` | `--emerald-dark` | Darker emerald accent |
| **Deep Green** | `#0d2822` | `--teal-deep` | Deep green tone |
| **Cyan Accent** | `#06b6d4` | `--cyan-accent` | Scanner highlights and visual effects |
| **Cyan Light** | `#67e8f9` | `--cyan-light` | Selected interactive focus effects |
| **Warm Background** | `#FAF3E2` | `--bg-deep-mesh` | Scanner page canvas |
| **Primary Text** | `#0f291e` | `--text-primary` | Scanner text |
| **Secondary Text** | `#334155` | `--text-secondary` | Supporting text |
| **Muted Text** | `#64748b` | `--text-muted` | Secondary labels |
| **White Glass** | `rgba(255, 255, 255, 0.96)` | `--obsidian-glass` | Light scanner surface |

> The name `--obsidian-glass` is retained from the existing CSS. Its current value is a nearly opaque white surface, not a dark glass color.

### 2.3 Login and About Page Colors

| Page | Color / Value | Source | Primary Use |
| :--- | :--- | :--- | :--- |
| **Login** | `#eab308` and `#ca8a04` | `styles.css` | Gold gradient for primary action buttons |
| **Login** | `rgba(10, 18, 14, 0.12)` | `styles.css` | Translucent container background |
| **Login** | `#fef08a` | `styles.css` | Heading color |
| **About** | `#059669` and `#064e3b` | `about.css` | Primary and deep-green accents |
| **About** | `#f8fafc` and `#ffffff` | `about.css` | Light background and card surfaces |
| **About** | `#0f172a` and `#475569` | `about.css` | Primary and muted text |
| **About** | `#0d9488` | `about.css` | Cyan/teal accent |

### Palette Consistency Notes

The palette is not yet maintained through a single shared token source. Before introducing additional colors, check the relevant page's stylesheet and reuse an existing token where practical.

---

## 3. Typography Hierarchy

Farm2Ayur uses a combination of sans-serif, serif, and display fonts. Their availability and application differ by page.

| Font Family | Classification | Observed Usage | Page / Source |
| :--- | :--- | :--- | :--- |
| **`Outfit`** | Geometric sans-serif | Main interface typography, navigation, buttons, scanner headings | `index.html`, `scan.html`, `login.html`, `assets/css/style.css`, `scan.css` |
| **`Lora`** | Serif | Main-page hero headings and editorial accents | `index.html`, `assets/css/overrides.css` |
| **`Plus Jakarta Sans`** | Sans-serif | Scanner body text and login page typography | `scan.html`, `login.html`, `scan.css`, `styles.css` |
| **`Cinzel`** | Classical serif | Login headings and selected display styling | `login.html`, `scan.html`, `about.html`, `styles.css`, `about.css` |
| **`Montserrat`** | Sans-serif | About-page body text and descriptions | `about.html`, `about.css` |
| **`Bebas Neue`** | Condensed display | About-page numeric and display accents | `about.html`, `about.css` |

### Typography Implementation Notes

- The main website imports `Lora` and `Outfit`; its primary font tokens use `Outfit`, with `Lora` used for serif treatments.
- The scanner and login pages import `Cinzel`, `Outfit`, and `Plus Jakarta Sans`, but their font usage is page-specific.
- The about page imports additional display fonts and uses Montserrat, Cinzel, and Bebas Neue in selected elements.
- Some imported fonts may not be actively used across every page. An import alone should not be taken as evidence of a consistent typographic role.

**Recommendation:** Use Outfit as the principal interface typeface and Lora for selected editorial headings on the main page. Preserve the scanner's readable interface typography and document page-specific display fonts until the styles are intentionally consolidated.

---

## 4. UI Components

Component specifications below describe observed page-specific implementations. They are not all universal components.

### 4.1 Buttons and Controls

| Component | Selector / Class | Key CSS Specification | Visual Appearance and Behaviour |
| :--- | :--- | :--- | :--- |
| **Main Emerald Button** | `.btn-primary` in `assets/css/style.css` | Uses emerald variables and a light border | Emerald-style action in the base main stylesheet; later overrides may change its appearance |
| **Main Site Final Override** | `.btn-primary` in `assets/css/overrides.css` | Dark-charcoal gradient, white text, `10px` radius | Dark action button on pages loading these overrides |
| **Login Gold Button** | `.btn-primary` in `styles.css` | `linear-gradient(135deg, #eab308, #ca8a04)`; `50px` radius | Gold gradient sign-in/sign-up action |
| **Scanner Emerald CTA** | `.btn-emerald` in `scan.css` | `linear-gradient(135deg, #10b981, #059669, #047857)`; `50px` radius | Emerald scanner action with glow, hover movement, and focus styling |
| **Scanner Circular Navigation** | `.scanner-nav-btn` in `scan.css` | `42px × 42px`; circular white button | Circular scanner control with hover and `:focus-visible` styling |
| **Main Outline Button** | `.btn-outline` in `assets/css/style.css` | Transparent background with a glass-border accent | Outline action; its appearance depends on the loaded stylesheet and overrides |

> **Important:** `.btn-primary` has multiple definitions across the project. Do not assume the login-page gold action and main-site dark action are the same visual component. Consolidate them only as a separate, deliberate UI consistency task.

### 4.2 Cards and Containers

| Component | Selector / Class | Key CSS Specification | Visual Appearance and Behaviour |
| :--- | :--- | :--- | :--- |
| **Main Content Card** | `.card` in `assets/css/style.css` | Token-based surface, `16px` radius, standard spacing token | General-purpose main-site content card |
| **Login Container** | `.container` in `styles.css` | `840px` width, `95%` maximum width, `520px` minimum height, translucent background, `30px` radius | Split-view authentication panel with animated sign-in/sign-up states |
| **Scanner Container** | `.camera-scanner-wrapper` in `scan.css` | `520px` maximum width; `88vh` height; `680px` minimum and `840px` maximum height; `36px` radius | Rounded scanner interface with camera viewport and controls |
| **Scanner Activation Card** | `.activation-card` in `scan.css` | Glass-like panel with blur, rounded corners, and emerald details | Camera activation and permission overlay |
| **About Page Member Panel** | `.member` and `.member.reverse` in `about.css` | Responsive two-sided content layout | Alternating developer/team information panels |

### 4.3 Badges and Status Indicators

| Component | Selector / Class | Observed Specification | Purpose |
| :--- | :--- | :--- | :--- |
| **Scanner HUD Stat Pill** | `.hud-stat-pill` | White translucent surface, emerald border, pill radius | Scanner telemetry and status labels |
| **Scanner Status Dots** | `.dot-emerald`, `.dot-cyan` | Small colored circles with animated states | Selected HUD and scanner status indicators |
| **Scanner Smart Badge** | `.smart-badge` | Dark translucent surface, emerald border, pill radius | Scanner state and contextual labels |
| **About Intro Badge** | `.intro-badge` | Emerald-accented label treatment | Section and introduction labels |
| **Main Navigation State** | `.nav-item.active` | Defined by main stylesheet and overrides | Current section/navigation state |

### 4.4 Form Controls

| Component | Selector / Class | Observed Specification | Purpose |
| :--- | :--- | :--- | :--- |
| **Main Form Inputs** | `.input-wrap input`, `.input-wrap select`, `.input-wrap textarea` | Main stylesheet tokens with focus-state rules | Data-entry forms |
| **Login Inputs** | Form fields in `styles.css` | Dark/translucent styling with the login visual theme | Login and registration form inputs |
| **Scanner Focus State** | `.scanner-nav-btn:focus-visible`, `.btn-emerald:focus-visible` | Explicit focus outlines in `scan.css` | Keyboard feedback for selected scanner controls |
| **Scanner Dialogs** | Scanner modal elements in `scan.html` | Dialog roles and labelled relationships on selected elements | Scanner help and result interfaces |

---

## 5. Layout, Spacing, and Elevation

### 5.1 Spacing and Width Tokens

The main stylesheet defines these spacing tokens:

| Token | Value | Intended Role |
| :--- | :--- | :--- |
| `--spacing-xs` | `0.5rem` | Compact gaps and padding |
| `--spacing-sm` | `1rem` | Standard component spacing |
| `--spacing-md` | `1.5rem` | Card and section spacing |
| `--spacing-lg` | `3rem` | Large section spacing |
| `--spacing-xl` | `5rem` | Major section separation |

Additional observed layout sizes include:

| Layout Role | Value | Source / Component |
| :--- | :--- | :--- |
| **Scanner Viewport** | `520px` maximum width | `.camera-scanner-wrapper` in `scan.css` |
| **Scanner Height** | `88vh`, with `680px` minimum and `840px` maximum | `.camera-scanner-wrapper` in `scan.css` |
| **Login Container** | `840px` width, `95%` maximum width | `.container` in `styles.css` |
| **About Page Responsive Layout** | Two-sided panels that stack on smaller screens | `.member` and `.member.reverse` in `about.css` |

### 5.2 Border Radius Scale

The main stylesheet defines:

- **Small — `8px`:** Compact controls and small interface elements.
- **Medium — `16px`:** Standard cards and content containers.
- **Large — `24px`:** Larger main-site content cards.

Additional component-specific values include:

- **Pill — `50px` / `999px`:** Buttons and status badges.
- **Scanner — `36px`:** Main scanner wrapper.
- **Login — `30px`:** Authentication container.
- **About and preview cards:** Values defined in their own component styles.

These are observed values across the current CSS, not yet a unified radius system.

### 5.3 Elevation and Shadows

The main stylesheet defines:

- `--shadow-premium: 0 10px 35px -10px rgba(0, 0, 0, 0.9)`
- `--shadow-glow: 0 0 25px rgba(16, 185, 129, 0.4)`

The scanner and preview define additional shadows, including emerald-tinted elevation, inset highlights, and hover glows.

For new components, reuse a shadow from the relevant page's existing stylesheet instead of introducing an unrelated shadow style.

---

## 6. Responsive Design

The project currently uses page-specific breakpoints rather than one centrally defined breakpoint system.

| Breakpoint / Context | Observed Behaviour | Source |
| :--- | :--- | :--- |
| **Scanner — `480px`** | Scanner wrapper adjusts its height and corner radius; reticle dimensions reduce and a secondary HUD label is hidden | `scan.css` |
| **Main Site — `600px`** | Main stylesheet has a small-screen media-query rule set | `assets/css/style.css` |
| **Main Site — `768px`** | Main stylesheet and overrides contain tablet/mobile layout adjustments | `assets/css/style.css`, `assets/css/overrides.css` |
| **Main Site — `900px`** | Navigation and header layout adjustments | Main stylesheet and overrides |
| **Main Site — `992px`** | Main stylesheet tablet-layout adjustments | `assets/css/style.css` |
| **About Page — `768px`** | Alternating member panels stack vertically and use full-width child sections | `about.css` |
| **Login Page** | Uses its own layout styles; responsive behaviour should be tested at narrow widths | `styles.css` |

### Responsive Validation Requirements

Before the design system is treated as consistent, test each page at mobile, tablet, and desktop widths.

Validation should include:

- Navigation and menus fit without horizontal overflow.
- Forms remain readable and usable at narrow widths.
- Scanner controls and camera overlays remain visible.
- Main headings and buttons do not overlap.
- Card layouts collapse correctly on small screens.
- Touch targets remain usable.
- Modal content fits within the visible viewport.

---

## 7. Accessibility

Accessibility features are implemented in selected components, but the entire interface has not been established as fully accessible.

| Capability | Observed Implementation | Status |
| :--- | :--- | :--- |
| **Scanner Keyboard Shortcuts** | `Space` for shutter, `T` for torch, `Z` for zoom, and `Escape` for selected modal/drawer interactions in `scan.js` | ✅ Implemented in scanner |
| **Focus Indicators** | Explicit `:focus-visible` outlines for selected scanner buttons and controls in `scan.css` | ✅ Implemented in selected controls |
| **Reduced Motion** | `prefers-reduced-motion: reduce` rules in the main stylesheet and overrides | ✅ CSS rules present; test behaviour on every page |
| **Live Status Announcements** | `aria-live="polite"` is present on selected scanner HUD and traceability status elements | ✅ Present in selected elements |
| **Dialog Semantics** | `role="dialog"` and labelled relationships are present on selected scanner overlays | ✅ Present in selected dialogs |
| **Color Contrast** | Multiple light and dark theme combinations are in use | 🟡 Needs contrast validation across actual states |
| **Keyboard Navigation** | Some controls have explicit focus styles and keyboard handlers | 🟡 Requires full-page testing |
| **Image Alternatives** | Verify meaningful alternative text for informational images and empty alternatives for decorative images | 🟡 Requires review |
| **Form Labels and Errors** | Verify labels, required fields, and accessible error feedback throughout all forms | 🟡 Requires review |

### Accessibility Principles

- Maintain visible keyboard focus.
- Do not communicate success, failure, or status through color alone.
- Provide meaningful labels for form fields and interactive icons.
- Ensure modal dialogs can be opened, navigated, and dismissed by keyboard.
- Respect reduced-motion preferences for animations.
- Validate color contrast against the actual background and component states before declaring compliance.

---

## 8. Design Preview and Maintenance

### Interactive Preview

[`docs/design-preview.html`](./design-preview.html) provides an interactive visual reference with embedded styles and token definitions.

The preview currently duplicates parts of the styling rather than importing a shared token source. Therefore, changes to the production CSS do not necessarily update the preview, and preview changes do not automatically update the production UI.

### Current Design-System Gaps

1. **Duplicate tokens:** Similar colors are defined under different token names in the main and scanner stylesheets.
2. **Component overrides:** Shared selectors such as `.btn-primary` have different definitions across pages.
3. **Page-specific typography:** Font imports and usage differ between the main site, scanner, login, and about pages.
4. **Preview drift:** The interactive preview has its own embedded CSS.
5. **Incomplete verification:** Responsive behaviour, keyboard access, and text contrast require testing across the whole interface.

### Recommended Future Improvements

1. Establish a small shared set of brand tokens for emeralds, warm neutral surfaces, text, borders, and spacing.
2. Keep specialised scanner and login styling where it is necessary, but document its scope explicitly.
3. Introduce component-specific button names or intentional variants to reduce ambiguity around `.btn-primary`.
4. Align the preview with the canonical tokens once the shared palette is agreed upon.
5. Validate accessibility and responsive behaviour before marking the design system fully implemented.

---

**Document Intent:** This specification describes the current Farm2Ayur UI implementation and its page-specific styling. It distinguishes observed styles from proposed consistency improvements. Update it when the relevant HTML, CSS, typography, or responsive rules change.
