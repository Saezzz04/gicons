/**
 * Convert kebab-case to PascalCase
 * e.g., "visual-studio-code" → "VisualStudioCode"
 */
export function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

/**
 * Generate a PascalCase component name from brand slug and filename.
 * e.g., ("stripe", "wordmark-blurple.svg") → "StripeWordmarkBlurple"
 */
export function fileToComponentName(brandSlug: string, filename: string): string {
  const base = filename.replace('.svg', '');
  return kebabToPascal(brandSlug) + kebabToPascal(base);
}

/**
 * Generate a kebab-case tag name from brand slug and filename.
 * e.g., ("stripe", "wordmark-blurple.svg") → "stripe-wordmark-blurple"
 */
export function fileToTagName(brandSlug: string, filename: string): string {
  const base = filename.replace('.svg', '');
  return `${brandSlug}-${base}`;
}
