# gicons

Open-source brand logo icons for React, Vue, Svelte, Angular, Web Components, and raw SVG. Tree-shakeable, typed, and ready to use.

## For AI Coding Assistants

> Copy this block into your project's `CLAUDE.md` or AI context to let your AI assistant find, install, and use brand icons instantly.

**gicons** provides brand logos as typed components. Install the package for your framework and import by name.

**Install:** `npm install @gicons/react` (or `pnpm add` / `yarn add` / `bun add`)
Replace `react` with: `vue`, `svelte`, `angular`, `web`, or `svg`

**Naming:** `{Brand}{Type}{Variant}` in PascalCase — e.g., `stripe/wordmark-blurple.svg` becomes `StripeWordmarkBlurple`

**Usage:**
```jsx
import { StripeWordmarkBlurple } from '@gicons/react';
<StripeWordmarkBlurple size={32} />
```

**Props:** `size` (default 24), `width`, `height`. React: all SVG props + `forwardRef`.

### Available Icons

| Brand | Components |
|-------|-----------|
| Stripe | `StripeWordmarkBlurple`, `StripeWordmarkSlate`, `StripeWordmarkWhite` |

> This table grows as brands are added. For the always-up-to-date full catalog:
> **GET `https://gicons.dev/api/icons`** — returns JSON with all brands, component names, and install commands.

---

## AI Skill

Give your AI assistant deep knowledge of gicons components, patterns, and best practices.

```bash
npx skills add gicons/gicons
```

Once installed, your AI assistant automatically knows how to find, install, and use any brand icon with the correct imports and patterns for your framework.

Learn more about skills at [skills.sh](https://skills.sh). See the full skill content at [gicons.dev/skill](https://gicons.dev/skill).

**Manual install:** You can also copy the skill content directly into your project's `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.windsurfrules`, or `AGENTS.md`.

---

## Installation

Pick the package for your framework:

### React

```bash
npm install @gicons/react
pnpm add @gicons/react
yarn add @gicons/react
bun add @gicons/react
```

### Vue

```bash
npm install @gicons/vue
pnpm add @gicons/vue
yarn add @gicons/vue
bun add @gicons/vue
```

### Svelte

```bash
npm install @gicons/svelte
pnpm add @gicons/svelte
yarn add @gicons/svelte
bun add @gicons/svelte
```

### Angular

```bash
npm install @gicons/angular
pnpm add @gicons/angular
yarn add @gicons/angular
bun add @gicons/angular
```

### Web Components

```bash
npm install @gicons/web
pnpm add @gicons/web
yarn add @gicons/web
bun add @gicons/web
```

### Raw SVG

```bash
npm install @gicons/svg
pnpm add @gicons/svg
yarn add @gicons/svg
bun add @gicons/svg
```

## Quick Start

### React

```jsx
import { StripeWordmarkBlurple } from '@gicons/react';

function App() {
  return <StripeWordmarkBlurple size={32} />;
}
```

### Vue

```vue
<script setup>
import { StripeWordmarkBlurple } from '@gicons/vue';
</script>

<template>
  <StripeWordmarkBlurple :size="32" />
</template>
```

### Svelte

```svelte
<script>
  import { StripeWordmarkBlurple } from '@gicons/svelte';
</script>

<StripeWordmarkBlurple size={32} />
```

### Angular

```typescript
import { StripeWordmarkBlurple } from '@gicons/angular';

@Component({
  imports: [StripeWordmarkBlurple],
  template: `<gicon-stripe-wordmark-blurple size="32" />`,
})
export class MyComponent {}
```

### Web Components

```html
<script type="module">
  import '@gicons/web';
</script>

<gicon-stripe-wordmark-blurple size="32"></gicon-stripe-wordmark-blurple>
```

## Available Packages

| Package | Framework | Peer Dependencies |
|---------|-----------|-------------------|
| `@gicons/react` | React 18+ | `react`, `react-dom` |
| `@gicons/vue` | Vue 3.3+ | `vue` |
| `@gicons/svelte` | Svelte 4+ | `svelte` |
| `@gicons/angular` | Angular 17+ | `@angular/core` |
| `@gicons/web` | Web Components | None |
| `@gicons/svg` | Raw SVGs | None |

## Props

All components accept:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Sets both width and height |
| `width` | `number \| string` | `size` | Override width |
| `height` | `number \| string` | `size` | Override height |

React components also accept all standard SVG props (`className`, `style`, `aria-label`, etc.) and support `ref` via `forwardRef`.

All components render with `aria-hidden="true"` and `focusable="false"` by default (overridable via props).

## TailwindCSS & shadcn/ui

All components are fully compatible with TailwindCSS (v3 and v4) and [shadcn/ui](https://ui.shadcn.com/).

### Sizing with Tailwind classes

```jsx
// Using Tailwind utilities to control size
<StripeWordmarkBlurple className="w-8 h-8" />
<StripeWordmarkBlurple className="size-6" />      // Tailwind v4
```

### Using with shadcn/ui

gicons components follow the same pattern as [lucide-react](https://lucide.dev/) (`aria-hidden`, `focusable="false"`, `forwardRef`, `SVGProps`), so they work as drop-in icons in any shadcn/ui component:

```jsx
import { Button } from '@/components/ui/button';
import { StripeWordmarkBlurple } from '@gicons/react';

<Button>
  <StripeWordmarkBlurple className="h-4 w-4" />
  Pay with Stripe
</Button>
```

### Overriding accessibility defaults

When an icon is meaningful (not decorative), override the defaults:

```jsx
<StripeWordmarkBlurple aria-hidden="false" aria-label="Stripe" role="img" />
```

### Framework-specific notes

| Framework | Tailwind class support |
|-----------|----------------------|
| **React** | `className` via props spread |
| **Vue** | `class` via `v-bind="$attrs"` |
| **Svelte** | `class` via `{...$$restProps}` |
| **Angular** | `class` input forwarded to SVG, host uses `display: contents` |
| **Web Components** | Classes on the host element size the component — SVG fills 100%. Use `::part(svg)` for advanced styling |

## Website

Browse, search, and download icons at [gicons.dev](https://gicons.dev).

## Adding New Brands

Adding a new brand requires no code changes — just SVGs and a `meta.json` file. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

## Development

```bash
git clone https://github.com/gicons/gicons.git
cd gicons
pnpm install
pnpm build
pnpm dev
```

## License

MIT License for the source code. Brand logos and trademarks are the property of their respective owners. See [LICENSE](LICENSE) for details.
