'use client';

import { useState } from 'react';
import { InstallTabs } from './install-tabs';

interface CodeSnippetProps {
  componentName: string;
  tagName: string;
  svgContent: string;
}

const FRAMEWORKS = ['React', 'Vue', 'Svelte', 'Angular', 'Web Component', 'SVG'] as const;

const FRAMEWORK_PACKAGES: Record<string, string> = {
  React: '@gicons/react',
  Vue: '@gicons/vue',
  Svelte: '@gicons/svelte',
  Angular: '@gicons/angular',
  'Web Component': '@gicons/web',
  SVG: '@gicons/svg',
};

function getSnippet(
  framework: (typeof FRAMEWORKS)[number],
  componentName: string,
  tagName: string,
  svgContent: string,
): string {
  switch (framework) {
    case 'React':
      return `import { ${componentName} } from '@gicons/react';\n\n<${componentName} size={32} />`;
    case 'Vue':
      return `<script setup>\nimport { ${componentName} } from '@gicons/vue';\n</script>\n\n<template>\n  <${componentName} :size="32" />\n</template>`;
    case 'Svelte':
      return `<script>\nimport { ${componentName} } from '@gicons/svelte';\n</script>\n\n<${componentName} size={32} />`;
    case 'Angular':
      return `import { ${componentName} } from '@gicons/angular';\n\n<gicon-${tagName} size="32"></gicon-${tagName}>`;
    case 'Web Component':
      return `import '@gicons/web';\n\n<gicon-${tagName} size="32"></gicon-${tagName}>`;
    case 'SVG':
      return svgContent;
  }
}

export function CodeSnippet({ componentName, tagName, svgContent }: CodeSnippetProps) {
  const [active, setActive] = useState<(typeof FRAMEWORKS)[number]>('React');
  const [copied, setCopied] = useState(false);

  const code = getSnippet(active, componentName, tagName, svgContent);
  const packageName = FRAMEWORK_PACKAGES[active];

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <InstallTabs packageName={packageName} />

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <div className="flex flex-wrap border-b border-gray-200 bg-gray-50" role="tablist" aria-label="Framework">
          {FRAMEWORKS.map((fw) => (
            <button
              key={fw}
              role="tab"
              aria-selected={active === fw}
              onClick={() => setActive(fw)}
              className={`px-3 py-2 text-xs font-medium transition-colors ${
                active === fw
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {fw}
            </button>
          ))}
        </div>
        <div className="relative" role="tabpanel">
          <pre className="overflow-x-auto p-4 text-sm leading-relaxed text-gray-800">
            <code>{code}</code>
          </pre>
          <button
            onClick={copy}
            aria-label="Copy code snippet"
            className="absolute right-2 top-2 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
