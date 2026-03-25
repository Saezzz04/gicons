'use client';

import { useState, useEffect } from 'react';

const MANAGERS = [
  { id: 'pnpm', label: 'pnpm', command: 'pnpm add' },
  { id: 'npm', label: 'npm', command: 'npm install' },
  { id: 'yarn', label: 'yarn', command: 'yarn add' },
  { id: 'bun', label: 'bun', command: 'bun add' },
] as const;

const STORAGE_KEY = 'gicons-pkg-manager';

interface InstallTabsProps {
  packageName: string;
}

export function InstallTabs({ packageName }: InstallTabsProps) {
  const [active, setActive] = useState('npm');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && MANAGERS.some((m) => m.id === stored)) {
      setActive(stored);
    }
  }, []);

  const select = (id: string) => {
    setActive(id);
    localStorage.setItem(STORAGE_KEY, id);
  };

  const manager = MANAGERS.find((m) => m.id === active)!;
  const command = `${manager.command} ${packageName}`;

  const copy = async () => {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <div className="flex border-b border-gray-200 bg-gray-50" role="tablist" aria-label="Package manager">
        {MANAGERS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={active === m.id}
            onClick={() => select(m.id)}
            className={`px-3 py-2 text-xs font-medium transition-colors ${
              active === m.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <div className="relative" role="tabpanel">
        <pre className="overflow-x-auto px-4 py-3 text-sm text-gray-800">
          <code>{command}</code>
        </pre>
        <button
          onClick={copy}
          aria-label="Copy install command"
          className="absolute right-2 top-2 rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-200"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
