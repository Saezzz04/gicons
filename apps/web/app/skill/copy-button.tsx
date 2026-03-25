'use client';

import { useState } from 'react';

interface CopyButtonProps {
  content: string;
  variant?: 'light' | 'dark';
  label?: string;
}

export function CopyButton({ content, variant = 'light', label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles =
    variant === 'dark'
      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
      : 'bg-gray-900 text-white hover:bg-gray-700';

  return (
    <button
      onClick={copy}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${styles}`}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}
