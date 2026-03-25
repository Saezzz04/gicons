/**
 * Parse an SVG string and extract viewBox and inner content.
 */
export interface ParsedSvg {
  viewBox: string;
  content: string;
}

export function parseSvg(svg: string): ParsedSvg {
  // Extract viewBox
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch?.[1] ?? '0 0 24 24';

  // Extract inner content (everything between <svg> and </svg>)
  const innerMatch = svg.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
  const content = innerMatch?.[1]?.trim() ?? '';

  return { viewBox, content };
}
