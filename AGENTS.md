# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js App Router project. Core layout and routes live in `app/` (`layout.tsx`, `page.tsx`, `globals.css`). Shared UI lives under `src/components/`, with page sections in `src/components/sections/` (PascalCase files) and reusable UI primitives in `src/components/ui/` (kebab-case files). Common hooks are in `src/hooks/` (e.g., `use-mobile.ts`), and shared utilities are in `src/lib/`. Static assets belong in `public/`. Build output is generated in `.next/` and should not be edited by hand.

## Build, Test, and Development Commands
Install dependencies first:
- `npm install`

Run locally and build:
- `npm run dev` — start the Next.js dev server.
- `npm run build` — create a production build in `.next/`.
- `npm run start` — run the built app locally.
- `npm run lint` — run Next.js ESLint rules.

## Coding Style & Naming Conventions
Use TypeScript/TSX and the App Router conventions. Follow the existing style: 2-space indentation, no semicolons, and single quotes in TS/TSX (JSX attributes use double quotes). Tailwind CSS is the primary styling approach; global styles live in `app/globals.css`. Prefer the import alias `@/` for modules under `src/` (configured in `tsconfig.json`).

Naming patterns:
- Section components: `PascalCase.tsx` in `src/components/sections/`.
- UI primitives: `kebab-case.tsx` in `src/components/ui/`.
- Hooks: `use-*.ts` in `src/hooks/`.

## Testing Guidelines
No test runner or `test` script is configured yet. If you add tests, define a `test` script in `package.json`, document the chosen framework here, and agree on a naming convention before adding many files.

## Commit & Pull Request Guidelines
Recent commits use a bracketed source tag plus a short summary (e.g., `[Claude Code] add pricing section`). Keep messages concise and imperative.

For PRs, include a brief description, link any related issues, list manual test steps, and attach screenshots for UI changes. Keep diffs focused; only update generated files when required (for example, `package-lock.json` after dependency changes).

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md<!-- NEXT-AGENTS-MD-END -->
