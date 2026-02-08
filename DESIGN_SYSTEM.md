# 🌌 PRICERNOT — COSMIC SCI-FI DESIGN SYSTEM

> **Theme**: Space-Time · Mystery · Advanced Technology  
> **Feeling**: Suspense, curiosity, immersion, cutting-edge technology

---

## 🎨 VISUAL LANGUAGE

### Core Concept
A modern, dark, mysterious website that evokes **space-time**, **cosmos**, and **something beyond reality**. The design communicates that something important is hidden beneath the surface, waiting to be discovered.

### Intended Emotional Response
- **Mystery** — subtle hints, enigmatic navigation
- **Depth** — layered compositions, floating elements
- **Suspense** — controlled reveals, cinematic timing
- **Advanced Technology** — futuristic UI, glassmorphism, glowing accents
- **Exclusivity** — feels like entering a hidden world

---

## 🌈 COLOR PALETTE

### Background Layers
```css
--void:         #000000    /* Pure black, the void */
--deep-space:   #0a0a0f    /* Primary background */
--abyss:        #0d0d14    /* Secondary depth */
--nebula-dark:  #12121c    /* Tertiary depth */
```

### Cosmic Accent Colors
```css
--stellar-purple:  #7c3aed   /* Primary brand, mystery */
--cosmic-blue:     #2563eb   /* Depth, technology */
--electric-cyan:   #06b6d4   /* Energy, interaction */
--neon-teal:       #14b8a6   /* Success, links */
--plasma-pink:     #d946ef   /* Highlights, special */
--void-red:        #dc2626   /* Live status, danger */
```

### Usage Guidelines
- **Purple (#7c3aed)**: Primary brand color, mystery, cosmic energy
- **Cyan (#06b6d4)**: Interactions, hover states, energy fields
- **Blue (#2563eb)**: Secondary brand, technology, depth
- **Red (#dc2626)**: Live indicators, urgent calls-to-action

---

## ✨ VISUAL EFFECTS

### Glassmorphism
- **Backdrop blur**: 20-24px
- **Saturation**: 180%
- **Background**: rgba(255, 255, 255, 0.03–0.06)
- **Border**: 1px solid rgba(255, 255, 255, 0.08)
- **Inset highlight**: rgba(255, 255, 255, 0.08–0.12)

### Glowing Accents
- **Text glow**: `text-shadow: 0 0 20-40px rgba(124, 58, 237, 0.4-0.6)`
- **Border glow**: `box-shadow: 0 0 30px rgba(124, 58, 237, 0.3)`
- **Hover intensify**: cyan glow `rgba(6, 182, 212, 0.5)`

### Nebula Background
- Multiple radial gradients (purple, blue, cyan, pink)
- Subtle pulsing animation (8-20s)
- Particle field overlay with drift animation (60s)

### Depth & Shadows
```css
--shadow-depth:    0 20px 60px rgba(0,0,0,0.7), 
                   0 8px 16px rgba(0,0,0,0.5)
--shadow-glow:     0 0 40px rgba(124,58,237,0.3), 
                   0 0 80px rgba(6,182,212,0.15)
--shadow-intense:  0 0 30px rgba(124,58,237,0.5), 
                   0 0 60px rgba(6,182,212,0.25)
```

---

## 📝 TYPOGRAPHY

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
             'Segoe UI', system-ui, sans-serif;
```

**Inter** — Modern, geometric, futuristic, excellent readability

### Hierarchy
```css
H1: 2.8–4.5rem, weight 900, letter-spacing -0.05em
    Gradient: white → purple
    Glow: 0 0 40px rgba(124,58,237,0.4)

H2: 2–3rem, weight 800, letter-spacing -0.04em
    Gradient: white 30% → purple 100%

H3: 1.3–1.8rem, weight 800, letter-spacing -0.03em

Body: 1rem, weight 400, line-height 1.6-1.7
      Color: rgba(255,255,255,0.95)

Secondary: rgba(255,255,255,0.75)
Tertiary:  rgba(255,255,255,0.55)
```

### Styling Guidelines
- **Generous letter-spacing** on headings for cinematic impact
- **Uppercase labels** with 0.05-0.12em tracking for technical feel
- **Gradient text** on major headings (white → purple)
- **Text glows** on hero title and brand mark

---

## 🏗️ LAYOUT & STRUCTURE

### Sectioning
1. **Header** (sticky)
   - Glassmorphic command bar
   - Pulsing brand mark
   - Glowing navigation links

2. **Hero** (immersive zone)
   - Cinematic padding (6rem top)
   - Two-column grid (1.15fr / 0.85fr)
   - Floating portrait with holographic badge
   - Quick-access tiles

3. **Content Sections**
   - 4rem vertical padding
   - Separator line (gradient fade)
   - Glass panels with hover lift

4. **Footer** (terminal signature)
   - Darker backdrop
   - Glowing separator
   - Minimal signature

### Grid Systems
```css
.grid-2: 1fr 1fr   (gap: 1.2rem)
.grid-3: 1fr 1fr 1fr (gap: 1.2rem)
```

### Spacing Scale
```css
--space-sm:  0.5-0.8rem
--space-md:  1.2-1.5rem
--space-lg:  2-2.5rem
--space-xl:  3-4rem
```

### Border Radius
```css
--radius-sm:  12px  (small UI)
--radius-md:  20px  (cards, panels)
--radius-lg:  28px  (hero portrait, major containers)
```

---

## 🎭 ANIMATIONS & MICRO-INTERACTIONS

### Timing Functions
```css
--ease-cosmic: cubic-bezier(0.34, 1.56, 0.64, 1)  /* playful bounce */
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)       /* material easing */
```

### Duration
```css
--transition-fast:   200ms
--transition-medium: 350ms
--transition-slow:   600ms
```

### Key Animations

#### 1. **fadeInUp** (hero entrance)
```css
from { opacity: 0; transform: translateY(40px); }
to   { opacity: 1; transform: translateY(0); }
Duration: 1s, cubic-bezier(0.34, 1.56, 0.64, 1)
```

#### 2. **nebulaPulse** (background breathing)
```css
0%, 100% { opacity: 0.85; transform: scale(1); }
50%      { opacity: 1; transform: scale(1.05) rotate(0.5deg); }
Duration: 20s, ease-in-out infinite alternate
```

#### 3. **particleDrift** (star field movement)
```css
0%   { background-position: 0 0, 40px 40px; }
100% { background-position: 80px 80px, 120px 120px; }
Duration: 60s, linear infinite
```

#### 4. **headerGlow** (command bar pulse)
```css
0%, 100% { border-bottom-color: rgba(124,58,237,0.2); }
50%      { border-bottom-color: rgba(6,182,212,0.3); }
Duration: 4s, ease-in-out infinite alternate
```

#### 5. **pulseMark** (brand icon)
```css
0%, 100% { box-shadow: 0 0 0 4px rgba(124,58,237,0.15), 
                       0 0 20px rgba(124,58,237,0.5); }
50%      { box-shadow: 0 0 0 8px rgba(6,182,212,0.2), 
                       0 0 30px rgba(6,182,212,0.6); }
Duration: 2s, ease-in-out infinite
```

### Hover States
- **Transform**: translateY(-3px to -6px) + scale(1.01-1.02)
- **Border intensify**: glass-border → cyan/purple at 0.3-0.5 opacity
- **Glow addition**: 0 0 20-50px cyan/purple
- **Arrow shift**: translateX(4px) on social cards

---

## 🧩 COMPONENT LIBRARY

### 1. Glass Panel
```css
padding: 1.5rem 1.6rem
border-radius: var(--radius-lg)
border: 1px solid rgba(255,255,255,0.08)
background: rgba(255,255,255,0.03)
backdrop-filter: blur(20px) saturate(180%)
box-shadow: depth + inset highlight
transition: all 350ms smooth
hover: lift -4px, glow, border cyan
```

### 2. Primary Button
```css
height: 52px
padding: 0 2rem
border-radius: 999px
border: 1px solid rgba(124,58,237,0.6)
background: linear-gradient(135deg, purple 0.9, cyan 0.7)
box-shadow: 0 0 30px rgba(124,58,237,0.4)
hover: lift -3px, scale 1.02, cyan glow
```

### 3. Ghost Button
```css
height: 52px
padding: 0 2rem
border-radius: 999px
border: 1px solid rgba(255,255,255,0.2)
background: rgba(255,255,255,0.05)
backdrop-filter: blur(10px)
hover: lift -3px, purple glow
```

### 4. Social Card (holographic)
```css
padding: 1.3rem 1.4rem
border-radius: var(--radius-lg)
border: 1px solid glass-border
background: glass + gradient overlay (opacity 0)
backdrop-filter: blur(20px) saturate(180%)
hover: lift -4px, gradient visible, cyan border, arrow shift
```

### 5. Portrait Container
```css
border-radius: var(--radius-lg)
border: 1px solid rgba(124,58,237,0.3)
background: glass
backdrop-filter: blur(20px) saturate(180%)
box-shadow: depth + purple glow (60px)
hover: lift -6px, scale 1.01, cyan border, intense glow
```

### 6. Badge / Pill
```css
height: 32px
padding: 0 1rem
border-radius: 999px
border: 1px solid rgba(124,58,237,0.3)
background: rgba(124,58,237,0.1)
text-transform: uppercase
letter-spacing: 0.02em
font-size: 0.82rem, weight 700
hover: cyan border + background, glow
```

---

## 📱 RESPONSIVE BREAKPOINTS

### Desktop (>1024px)
- Full grid layouts
- Generous padding
- All animations active

### Tablet (920px–1024px)
- Hero becomes single column
- Portrait height: 400px
- Section padding: 3.5rem

### Mobile (720px–920px)
- Mobile nav toggle appears
- All grids become single column
- Section padding: 3.5rem

### Small Mobile (<720px)
- Hero padding: 4rem → 3rem
- Mobile nav with glassmorphic dropdown
- Full-width CTA buttons
- Portrait height: 360px

### Tiny (<480px)
- Container padding: 2rem
- Hero padding: 3rem → 2.5rem
- Minimum font sizes active

---

## ♿ ACCESSIBILITY

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * { 
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

### Focus States
- Skip link with translateY animation
- Outline: 2px solid cyan, offset 3px
- Keyboard navigation styled identically to hover

### ARIA & Semantics
- Proper heading hierarchy (H1 → H2 → H3)
- `aria-label` on decorative elements
- `role="list"` on card grids
- `sr-only` class for screen reader text

---

## 🎬 CONCEPTUAL REFERENCES

### Films & Media
- **Blade Runner 2049** — dark, neon-lit, mysterious depth
- **Interstellar** — space-time, cosmic scale, emotional depth
- **Tron: Legacy** — glowing lines, digital grid, futuristic UI
- **Ghost in the Shell** — cyberpunk, holographic interfaces
- **Ex Machina** — minimalist tech, glass surfaces, AI mystery

### Design Inspirations
- **Apple Vision Pro UI** — glassmorphism, depth, floating elements
- **SpaceX interfaces** — technical precision, dark mode, data visualization
- **Sci-fi HUDs** — heads-up displays, glowing borders, layered information
- **Particle simulations** — nebulae, energy fields, cosmic dust

### Mood Keywords
```
COSMIC · ENIGMATIC · FUTURISTIC · DEEP · IMMERSIVE
MYSTERIOUS · TECHNOLOGICAL · CINEMATIC · EXCLUSIVE · SUSPENSEFUL
```

---

## 🚀 IMPLEMENTATION NOTES

### Performance
- CSS animations use `transform` and `opacity` (GPU-accelerated)
- `backdrop-filter` fallback for older browsers
- Lazy-load images below fold
- Preconnect to font CDN

### Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for glassmorphism
- No IE11 support

### Future Enhancements
- **Parallax scrolling** on hero background
- **Particle.js integration** for interactive star field
- **GSAP animations** for scroll-triggered reveals
- **Three.js** for 3D cosmic objects
- **Lottie animations** for icon micro-interactions

---

## 📐 TECHNICAL SPECS

### Font Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### Critical CSS Variables
```css
:root {
  --void: #000000;
  --stellar-purple: #7c3aed;
  --electric-cyan: #06b6d4;
  --glass: rgba(255,255,255,0.03);
  --glass-border: rgba(255,255,255,0.08);
  --text-primary: rgba(255,255,255,0.95);
  --shadow-glow: 0 0 40px rgba(124,58,237,0.3), 0 0 80px rgba(6,182,212,0.15);
  --radius-lg: 28px;
  --ease-cosmic: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

**Design System Version**: 1.0  
**Last Updated**: February 2026  
**Status**: Production Ready 🌌

> *"This website exists at the intersection of space, time, and advanced technology — a portal to something beyond."*
