# Contributing to gicons

Thanks for your interest in contributing! This guide explains how to add new brand icons and contribute to the project.

## Adding a New Brand

Adding a brand is the most common contribution. No code changes required — just SVGs and metadata.

### 1. Create the brand directory

```
packages/svg/src/brands/{brand-slug}/
```

Use **kebab-case** for the directory name (e.g., `google`, `github`, `visual-studio-code`).

### 2. Add SVG files

Place your SVG files following this naming convention:

```
{type}-{variant}.svg
```

- **type**: `logo`, `wordmark`, `mark`, `icon`
- **variant**: `color`, `white`, `dark`, `monochrome`, or brand-specific (e.g., `blurple`)

Examples:
- `logo-color.svg` — Full color logo
- `wordmark-white.svg` — White wordmark for dark backgrounds
- `mark-dark.svg` — Dark icon mark

### 3. Create meta.json

Every brand needs a `meta.json` file:

```json
{
  "name": "Brand Name",
  "slug": "brand-name",
  "category": "category",
  "tags": ["tag1", "tag2"],
  "website": "https://brand.com",
  "colors": {
    "primary": "#000000"
  },
  "license": "trademark",
  "variants": [
    {
      "file": "logo-color.svg",
      "type": "logo",
      "variant": "color",
      "background": "light"
    }
  ]
}
```

**Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Display name of the brand |
| `slug` | Yes | Kebab-case identifier (must match directory name) |
| `category` | Yes | One of: `payments`, `social`, `devtools`, `cloud`, `design`, `communication`, `productivity`, `other` |
| `tags` | Yes | Search keywords |
| `website` | Yes | Official brand website |
| `colors.primary` | Yes | Primary brand color (hex) |
| `colors.secondary` | No | Secondary brand color (hex) |
| `license` | Yes | Always `"trademark"` for brand logos |
| `variants` | Yes | Array of variant objects |

**Variant fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `file` | Yes | SVG filename |
| `type` | Yes | `logo`, `wordmark`, `mark`, or `icon` |
| `variant` | Yes | Color variant name |
| `background` | Yes | `"light"` or `"dark"` — recommended background |

### 4. SVG Quality Requirements

- **Must have a `viewBox` attribute** — required for proper scaling
- **No hardcoded `width`/`height`** — these are set by the component props
- **No external CSS or fonts** — all styles must be inline
- **No raster images embedded** — pure vector only
- **Optimized** — remove unnecessary metadata, comments, editor artifacts
- **No `xmlns` attribute needed** — it's added during build

### 5. Build and verify

```bash
pnpm build
```

This will optimize your SVGs, fetch real favicons from the brand's website domain, generate components for all frameworks, and update the manifest. Favicons are fetched automatically using the `website` URL in `meta.json`. Check that your brand appears correctly.

## Development Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_ORG/gicons.git
cd gicons

# Install dependencies
pnpm install

# Build everything
pnpm build

# Start the dev website
pnpm dev
```

## Pull Request Process

1. Fork the repository
2. Create a branch: `git checkout -b add-brand-name`
3. Add your brand following the steps above
4. Run `pnpm build` to verify everything works
5. Commit your changes
6. Open a pull request with:
   - Brand name in the title (e.g., "Add Google brand icons")
   - Source/attribution for the SVGs
   - Screenshot of the icons rendering correctly

## Code Contributions

For changes to build scripts, templates, or the website:

1. Open an issue first to discuss the change
2. Follow existing code patterns and conventions
3. Ensure `pnpm build` passes without errors
4. Test with the dev website (`pnpm dev`)

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/) code of conduct. Be kind and respectful.

## License

By contributing, you agree that your contributions will be licensed under the MIT License. Note that brand logos remain trademarks of their respective owners.
