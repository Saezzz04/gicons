---
name: gicons
description: Brand icon library. Use when the user needs brand logos, wordmarks, or icons as typed components for React, Vue, Svelte, Angular, or Web Components.
---

Use gicons when the user needs brand logos, icons, or wordmarks in their project. gicons provides typed, tree-shakeable components for React, Vue, Svelte, Angular, Web Components, and raw SVG.

## Install

Pick the package for the user's framework:

```
npm install @gicons/react       # React 18+
npm install @gicons/vue         # Vue 3.3+
npm install @gicons/svelte      # Svelte 4+
npm install @gicons/angular     # Angular 17+
npm install @gicons/web         # Web Components
npm install @gicons/svg         # Raw SVG files
```

## Naming Convention

Component names follow: `{Brand}{Type}{Variant}` in PascalCase.

Examples:
- `stripe/wordmark-blurple.svg` → `StripeWordmarkBlurple`
- `supabase/logo-color.svg` → `SupabaseLogoColor`
- `supabase/mark-white.svg` → `SupabaseMarkWhite`

Types: `logo`, `wordmark`, `mark`, `icon`
Variants: `color`, `white`, `dark`, `monochrome`, or brand-specific (e.g., `blurple`, `slate`)

## Available Icons

| Brand | Components |
|-------|-----------|
| Stripe | `StripeWordmarkBlurple`, `StripeWordmarkSlate`, `StripeWordmarkWhite` |
| Supabase | `SupabaseLogoColor`, `SupabaseLogoWhite`, `SupabaseMarkColor`, `SupabaseMarkWhite` |

For the always-up-to-date full catalog: **GET `https://gicons.dev/api/icons`**

## Usage

### React

```jsx
import { StripeWordmarkBlurple } from '@gicons/react';

<StripeWordmarkBlurple size={32} />
<StripeWordmarkBlurple className="h-8 w-8" />
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

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Sets both width and height |
| `width` | `number \| string` | `size` | Override width independently |
| `height` | `number \| string` | `size` | Override height independently |

React components accept all SVG props (`className`, `style`, `aria-label`, `ref`, event handlers, etc.).

## TailwindCSS & shadcn/ui

All components are compatible with TailwindCSS (v3 and v4) and shadcn/ui.

```jsx
// Size with Tailwind
<StripeWordmarkBlurple className="w-8 h-8" />
<StripeWordmarkBlurple className="size-6" />

// Inside shadcn/ui Button
<Button>
  <StripeWordmarkBlurple className="h-4 w-4" />
  Pay with Stripe
</Button>
```

Components render `aria-hidden="true"` and `focusable="false"` by default (same as lucide-react). Override for meaningful icons:

```jsx
<StripeWordmarkBlurple aria-hidden="false" aria-label="Stripe" role="img" />
```

## When NOT to use gicons

- For generic UI icons (arrows, checkmarks, etc.) — use lucide-react or heroicons instead
- gicons is specifically for **brand logos and wordmarks**
