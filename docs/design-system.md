# Visual Design System & UI Constraints

## 1. Design Philosophy (设计理念)

- **Minimalism (极简):** Less is more. Use whitespace (padding/margin) generously instead of visible borders or dividers to separate content.
- **Modernity (现代):** High contrast, crisp typography, and subtle depth.
- **Focus (专注):** The content (blog posts) is the hero. UI elements should fade into the background until interacted with.

## 2. Color Palette (色彩系统)

We use Tailwind CSS colors. The theme is a high-contrast monochromatic base with a single sophisticated accent color.

- **Base Theme (shadcn/ui `zinc` preset is heavily preferred):**
  - **Light Mode:** Pure White (`bg-white`), Text is heavy gray (`text-zinc-900`), Subtitles (`text-zinc-500`).
  - **Dark Mode:** Deep Black (`bg-zinc-950` or `#09090b`), Text is off-white (`text-zinc-100`), Subtitles (`text-zinc-400`).
- **Accent Color (Primary):**
  - Use `zinc-900` (Light) and `zinc-50` (Dark) for primary buttons (High contrast black/white buttons).
  - Hover states should have a subtle opacity change (e.g., `hover:opacity-90`), NOT a color change.
- **Borders & Dividers:**
  - Extremely subtle. Use `border-zinc-200` (Light) and `border-zinc-800` (Dark).
  - Avoid borders if spacing can do the job.

## 3. Typography (排版规范)

Typography is the core of a blog. We use a dual-font strategy.

- **UI & Headings (Sans-serif):**
  - Font: `Geist Sans`, `Inter`, or System UI.
  - Styling: Keep it clean. Headings (`h1`, `h2`) should be bold (`font-bold` or `font-semibold`) and tightly tracked (`tracking-tight`).
- **Blog Body Content (Reading):**
  - Use Tailwind `@tailwindcss/typography` plugin (`prose`).
  - Override prose styles to be minimalist: no background colors for inline code (just a subtle border), muted blockquotes with a left border only.
- **Line Height:** Relaxed for reading (`leading-relaxed` or `leading-7` in body).

## 4. Layout & Spacing (布局与留白)

- **Max Width:** Keep the reading container narrow for optimal readability (e.g., `max-w-3xl` or `max-w-2xl` for articles).
- **Grid:** Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for post lists with adequate gaps (`gap-8` or `gap-12`).
- **Border Radius:** Modern and sharp, but not aggressive. Default to `rounded-lg` or `rounded-xl` for cards and images. Avoid fully rounded pill shapes unless it's a specific badge.
- **Shadows:** Avoid heavy drop shadows. Use subtle, diffuse shadows for hover states only (`hover:shadow-lg` with low opacity), or rely on border color changes.

## 5. Components Override (shadcn/ui 约束)

When implementing `shadcn/ui` components, apply these specific aesthetic overrides:

- **Buttons:** Flat, no shadows.
- **Cards:** Transparent background by default, or subtle off-background color (`bg-zinc-50` / `bg-zinc-900`). No visible borders unless hovered.
- **Inputs:** Minimalist. Bottom border only (Material style) OR very subtle full border (`border-zinc-200`) with no focus ring, just a border color change on focus.

## 6. Motion & Interaction (动效规范 - GSAP)

Animations should feel like physical objects (spring physics), not linear slides.

- **Page Transitions:** Fade in and subtle slide up (`y: 20`, `opacity: 0` to `y: 0`, `opacity: 1`).
- **List Staggering:** When loading the blog index, stagger the post cards appearing (`stagger: 0.1`, `ease: "power3.out"`).
- **Hover Effects:** Scale up slightly (`scale: 1.02`) on image cards, but keep it extremely snappy (duration: 0.2s - 0.3s).
- **Rule:** If the animation delays the user from reading the content, it is too slow.
