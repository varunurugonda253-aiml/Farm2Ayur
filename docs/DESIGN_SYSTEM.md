# 🎨 Farm2Ayur — Design System Document

> **"Soil to Synergy"** — Visual identity, UI components, typography, color palette, and interaction guidelines for the Farm2Ayur interface.

---

### 📋 Document Metadata

| Attribute | Details | Attribute | Details |
| :--- | :--- | :--- | :--- |
| **System Name** | **Farm2Ayur Design System** | **Current Stage** | 🟡 Prototype (v1.0) |
| **Framework** | Vite · HTML5 · CSS3 · ES Modules | **Design Style** | Frosted Glassmorphism & Organic Emerald |
| **Typography** | Cinzel · Outfit · Plus Jakarta Sans | **Primary Palette** | Emerald (`#10b981`), Gold (`#eab308`), Obsidian |

---

## 1. Design Overview

The **Farm2Ayur** user interface bridges classical Ayurvedic botanical heritage with modern digital ag-tech aesthetics.

### Key Design Principles
- **Frosted Glassmorphism:** Translucent glass surfaces (`backdrop-filter: blur(12px–18px)`), subtle borders (`rgba(16, 185, 129, 0.25)`), and elevated radial glow shadows.
- **Botanical Emerald & Gold Tones:** A curated color scheme combining deep plant greens (`#064e3b`, `#10b981`), cyber cyan highlights (`#06b6d4`), and warm golden accents (`#eab308`, `#fef08a`).
- **Dynamic Micro-Interactions:** Reactive cursor lighting, ambient mesh animations, live WebRTC camera HUD overlays, laser scanning sweeps, and smooth button hover scaling.
- **Classical & Modern Typography:** Pairings of traditional serif display fonts (*Cinzel*) with clean, highly readable sans-serif body typography (*Plus Jakarta Sans*, *Outfit*, *Montserrat*).

---

## 2. Color Palette & Typography

### Verified Color Tokens

| Token / Usage | Hex / RGBA Code | Visual Role |
| :--- | :--- | :--- |
| **Primary Emerald** | `#10b981` / `--emerald-primary` | Main action buttons, reticle borders, focus indicators |
| **Emerald Light** | `#34d399` / `--emerald-light` | Accent text, reticle sweep highlights, positive badges |
| **Emerald Dark** | `#047857` / `#064e3b` | Dark headers, high-contrast text, primary badges |
| **Cyan Accent** | `#06b6d4` / `#0d9488` | Laser scan sweeps, secondary glows, HUD indicators |
| **Gold Primary** | `#eab308` / `#ca8a04` | Login buttons, gold badges, primary CTAs |
| **Gold Light** | `#fef08a` | Display headings, social icon borders, hover text |
| **Deep Mesh BG** | `#FAF3E2` / `#0c1813` | Scanner page background, login vignette backdrop |
| **Frosted Glass** | `rgba(255, 255, 255, 0.96)` | Scanner card wrapper, modal backdrops |
| **Ultra Glass** | `rgba(10, 18, 14, 0.12)` | Translucent login containers and toggle overlays |
| **Text Primary** | `#0f291e` / `#0f172a` | Main body text, high-contrast headings |
| **Text Muted** | `#334155` / `#64748b` | Subtitles, HUD labels, secondary descriptions |

### Typography Hierarchy

| Font Family | Usage | Weights & Style |
| :--- | :--- | :--- |
| **`'Cinzel', serif`** | Display titles, modal headers, brand wordmarks | `700`, `800` Bold / Display |
| **`'Outfit', sans-serif`** | Shimmer headings, camera HUD titles | `700` Bold Display |
| **`'Plus Jakarta Sans', sans-serif`** | Scanner UI, form inputs, body text | `400`, `500`, `600`, `700` |
| **`'Montserrat', sans-serif`** | About page content, intro badges | `500`, `600`, `700` |
| **`'Bebas Neue', sans-serif`** | Display background numbers, team names | `400` Large Display |

---

## 3. UI Components

### Buttons
- **Primary Emerald Button (`.btn-emerald`):** Full rounded pill (`border-radius: 50px`), green gradient (`#10b981` → `#059669` → `#047857`), emerald shadow glow (`0 4px 20px rgba(16, 185, 129, 0.45)`), scale hover effect (`transform: scale(1.03)`).
- **Primary Gold Button (`.btn-primary`):** Gold gradient (`#eab308` → `#ca8a04`), dark text (`#040907`), 50px pill radius, yellow shadow glow.
- **Outline Glass Button (`.btn-outline`):** Translucent backdrop (`rgba(0, 0, 0, 0.25)`), gold border (`rgba(254, 240, 138, 0.7)`), gold hover glow.
- **Scanner Nav Button (`.scanner-nav-btn`):** 42px × 42px circular white glass icon button with emerald hover border.

### Cards & Containers
- **Frosted Glass Container (`.container`):** `rgba(10, 18, 14, 0.12)` translucent background, `backdrop-filter: blur(16px)`, `border-radius: 30px`, white glass border (`1px solid rgba(255, 255, 255, 0.18)`).
- **Camera Scanner Box (`.camera-scanner-wrapper`):** 520px max-width, 36px border-radius, `1.5px solid rgba(16, 185, 129, 0.25)` border, elevated shadow (`0 25px 70px rgba(16, 185, 129, 0.12)`).
- **Activation Card (`.activation-card`):** Glass overlay card featuring reticle corner brackets and laser sweep animations.

### Badges & Status Indicators
- **HUD Stat Pills (`.hud-stat-pill`):** Frosted white pill badge (`rgba(255, 255, 255, 0.92)`), backdrop blur, and pulsing status dots (`.dot-emerald`, `.dot-cyan`, `.dot-teal`).
- **Intro & Leaf Badges (`.intro-badge`, `.leaf-badge`):** Uppercase tracking badges with 6px letter spacing and translucent borders.

### Form Inputs
- **Glass Inputs (`input`):** Translucent dark background (`rgba(0, 0, 0, 0.3)`), `border-radius: 14px`, bright placeholder text (`#e2e8f0`), and emerald focus glow (`border-color: #10b981`, `box-shadow: 0 0 15px rgba(16, 185, 129, 0.4)`).

---

## 4. Layout & Spacing

### Container Boundaries
- **Login Container:** Centered `840px` max-width, `520px` min-height.
- **Scanner Box:** Centered `520px` max-width, `88vh` height (`680px` min, `840px` max).
- **Hero & Content Containers:** `1100px` max-width for readable text alignment.

### Border Radius Scale
- `50px` / `999px`: Action buttons, pill badges, nav buttons.
- `36px` / `30px` / `28px`: Main glass containers, scanner wrappers, modal cards.
- `14px` / `12px` / `8px`: Form inputs, icon containers, tags.

### Elevation & Shadows
- **Elevated Glass Shadow:** `0 25px 70px rgba(16, 185, 129, 0.12), 0 4px 25px rgba(0, 0, 0, 0.04)`
- **Card Border Inset:** `inset 0 1px 0 rgba(255, 255, 255, 0.8)`
- **Glow Shadow:** `0 0 20px rgba(234, 179, 8, 0.4)`, `0 0 15px #10b981`

---

## 5. Responsive Design

### Media Query Breakpoints
The codebase includes responsive styling targeting mobile and tablet viewports via `@media (max-width: 768px)`:

- **Layout Stacking:** 2-column flex layouts (e.g., team cards `.member`) stack vertically (`flex-direction: column`).
- **Fluid Typography:** Headings utilize CSS `clamp()` functions for fluid scaling across screen widths (e.g., `font-size: clamp(60px, 10vw, 170px)`).
- **Adaptive Viewports:** Scanner containers dynamically adapt to screen height (`max-width: 95%`, `height: 88vh`).

---

## 6. Accessibility

### Implemented Features
- **Keyboard Navigation Shortcuts (`scan.js`):**
  - `Space`: Triggers plant leaf shutter scan.
  - `T` / `t`: Toggles camera torch/flashlight.
  - `Z` / `z`: Toggles 2x digital macro zoom.
  - `Escape`: Closes active result drawers and informational modals.
- **Focus Indicators:** Interactive buttons and links define clear `:focus-visible` states (`outline: 2px solid #10b981`, `outline-offset: 3px`).
- **Text Contrast:** Crisp white (`#ffffff`) or deep emerald (`#0f291e`) text on translucent dark/light glass overlays.

### Recommendations for Future Scope
- *ARIA Attributes:* Add explicit `aria-expanded`, `aria-live="polite"` (for HUD diagnostics), and `role="dialog"` to modals for WCAG 2.1 AA compliance.
