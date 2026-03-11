# TiffinConnect V3.0 Design System: Admin Panel & Global Core

This document captures the distilled styling tokens, component rules, and layout patterns of the TiffinConnect Admin Panel (V3.0 Redesign). These guidelines serve as the blueprint for extending the "Premium & Readable" aesthetic across the entire web application.

## 1. Core Foundations

### 1.1 Typography (Modern & Legible)
We prioritize clarity over stylization.
- **Primary Body Font**: `Inter`, system-ui, sans-serif
- **Heading Font**: `Inter`, `Plus Jakarta Sans`
- **Mini-Labels/Metadata**: `Inter` (Bold, Uppercase, Tracking-Widest)
- **Weights**:
  - `font-bold` (700) for Titles and Primary Actions.
  - `font-semibold` (600) for Subtitles and Section Headers.
  - `font-medium` (500) for Sidebar Links and Body metadata.
  - `font-normal` (400) for descriptive paragraphs.

### 1.2 Color Palette (The "Emerald Premium" Theme)
Using HSL variables for maximum flexibility in Light/Dark modes.

| Variable | Light Mode (Default) | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--primary` | `158 64% 52%` (Emerald) | Same | Primary accents, buttons, active dots. |
| `--background` | `0 0% 100%` | `224 71% 4%` | Main page background. |
| `--card` | `0 0% 100%` | `224 71% 5%` | Card backgrounds. |
| `--border` | `220 13% 91%` | `224 71% 12%` | Subtle dividers. |
| `--primary/50` | Emerald 50% Opacity | Emerald 50% Opacity | Permanent card borders. |

---

## 2. Global Component Classes

These classes are defined in `index.css` and used across the application.

### 2.1 The Premium Block (`.premium-card`)
The signature container for all data blocks.
```css
.premium-card {
  background-color: hsl(var(--card));
  border: 1px solid hsla(var(--primary), 0.5); /* Fixed Green Border */
  border-radius: 2.5rem; /* Large rounded corners */
  padding: 2.5rem; /* Standardized 10px in tailwind = 40px */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  /* NO HOVER EFFECTS - Removed to increase stability */
}
```

### 2.2 Branding Badge (`.badge-premium`)
Used for section labels like "Supply Chain" or "Trust & Safety".
```css
.badge-premium {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  background-color: hsla(var(--primary), 0.1);
  color: hsl(var(--primary));
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: 1px solid hsla(var(--primary), 0.2);
}
```

---

## 3. Layout Patterns

### 3.1 Sidebar (Compact & Functional)
- **Menu Items**: `h-11` (Height), `px-4` (Padding), `rounded-xl`.
- **Active State**: `bg-primary/10`, `text-primary`, `border-primary/20`.
- **Motion**: [Framer Motion] `layoutId="sidebar-active-indicator"` (subtle sliding dot).
- **Footer**: Profile on left (User Icon + Name), Logout and Theme on right.

### 3.2 Page Headers
- **H2 Title**: `text-4xl` or `text-5xl`, `font-bold`, `tracking-tight`, `text-foreground`.
- **Tagline/Sub-text**: `text-muted-foreground`, `font-semibold`, `max-w-2xl`.

### 3.3 Dashboard Grids
- **Stats Row**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`.
- **Main Feed**: `grid grid-cols-1 lg:grid-cols-3 gap-12` (Main content 2/3, Sidebar 1/3).

---

## 4. Status Indicators (V3.0 Standard)

Use these consistent styles for badges across the app:

- **Verified/Success**: `bg-green-500/10 text-green-600 border-green-500/20`
- **Warning/Pending**: `bg-amber-500/10 text-amber-600 border-amber-500/20`
- **Error/Destructive**: `bg-red-500/10 text-red-600 border-red-500/20`
- **General Info**: `bg-primary/10 text-primary border-primary/20`

---

## 5. Animation Strategy
- **Entry**: `motion.div` with `initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`.
- **Scroll**: `scrollbar-hide` for a clean look, or `custom-scrollbar` with thin track.
- **Page Transitions**: `AnimatePresence` for smooth fades between dashboard modules.

---

**V3.0 Philosophy**: Static High Visibility > Dynamic Flashy Movements. Always ensure text is readable first, and use the Emerald green (`--primary`) sparingly but effectively for navigation and focus.
