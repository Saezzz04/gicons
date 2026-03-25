import { optimize } from 'svgo';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateSvg(content: string): ValidationResult {
  const errors: string[] = [];

  if (!content.includes('<svg')) {
    errors.push('Not a valid SVG file');
    return { valid: false, errors };
  }

  if (!content.match(/viewBox\s*=/)) {
    errors.push('Missing viewBox attribute (required for scaling)');
  }

  if (content.includes('<image')) {
    errors.push('Contains embedded raster images (must be pure vector)');
  }

  if (content.includes('<foreignObject')) {
    errors.push('Contains foreignObject (not supported)');
  }

  if (content.match(/@import|url\s*\(/)) {
    errors.push('Contains external CSS references');
  }

  return { valid: errors.length === 0, errors };
}

export function optimizeSvg(content: string): string {
  const result = optimize(content, {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: { overrides: { removeViewBox: false } },
      },
      'removeDimensions',
      'removeXMLNS',
      { name: 'sortAttrs' },
    ],
  });
  return result.data;
}
