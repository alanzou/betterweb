# Better Web - Modern Web Solutions

A premium web design landing page built with Next.js 15, React 19, and Tailwind CSS.

## 🚀 Tech Stack

- **Framework:** Next.js 15.1.6 (App Router)
- **React:** 19.2.0
- **TypeScript:** 5.9.3
- **Styling:** Tailwind CSS 3.4.19
- **UI Components:** shadcn/ui + Radix UI
- **Icons:** Lucide React
- **Font Optimization:** next/font (Inter + Orbitron)

## 📦 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
project/
├── app/                     # Next.js App Router
│   ├── layout.tsx          # Root layout with SEO & fonts
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── src/
│   ├── components/
│   │   ├── sections/       # Landing page sections
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
├── public/                 # Static assets
└── [config files]
```

## 🎨 Features

- ✅ Server-side rendering (SSR)
- ✅ Static site generation (SSG)
- ✅ SEO optimized with metadata API
- ✅ Responsive design
- ✅ Dark theme optimized
- ✅ Custom animations
- ✅ Glass morphism UI
- ✅ Font optimization
- ✅ Automatic code splitting

## 📱 Sections

1. **Navigation** - Sticky header with smooth scroll
2. **Hero** - Animated hero section with stats
3. **Services** - Service cards with hover effects
4. **Testimonials** - Client testimonial carousel
5. **Pricing** - Pricing plans comparison
6. **CTA** - Call-to-action section
7. **Footer** - Footer with social links

## 🎯 SEO & Performance

### Metadata
- Configured Open Graph tags
- Twitter Card support
- Proper meta descriptions
- Robots.txt configuration

### Performance Optimizations
- Next.js automatic image optimization
- Font preloading with next/font
- Package import optimization
- Static page pre-rendering
- Code splitting

## 🎨 Design System

### Color Palette
```css
--bw-bg: #050510              /* Background */
--bw-accent: #00d4ff          /* Primary accent */
--bw-success: #00ff88         /* Success/highlight */
--bw-text: #ffffff            /* Primary text */
--bw-text-secondary: #a0a0b0  /* Secondary text */
```

### Custom Utilities
- `.glass-card` - Glassmorphism card effect
- `.glow-border` - Animated glow border
- `.text-gradient` - Gradient text effect
- `.btn-primary` - Primary button style
- `.animate-float` - Floating animation

## 🔧 Configuration

### Tailwind CSS
Custom configuration with:
- HSL color variables
- Custom animations
- Glass morphism utilities
- Responsive breakpoints

### TypeScript
- Strict mode enabled
- Path aliases: `@/*` → `./src/*`
- Next.js TypeScript plugin

### ESLint
- Next.js recommended config
- TypeScript support
- Custom rule adjustments

## 📝 Development Notes

### Client Components
All section components are marked with `'use client'` directive due to:
- React hooks usage (useState, useEffect, useRef)
- Event handlers
- Browser API access

### Image Optimization
Consider migrating `<img>` tags to `next/image` for:
- Automatic optimization
- Responsive images
- Lazy loading
- Modern format support (AVIF, WebP)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
```bash
# Build
npm run build

# The build output is in .next/
# Configure your platform to serve from this directory
```

## 📄 Migration

This project was migrated from Vite to Next.js 15. See [MIGRATION.md](./MIGRATION.md) for details.

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Next.js 15
