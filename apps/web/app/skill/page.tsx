import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Metadata } from 'next';
import { CopyButton } from './copy-button';

export const metadata: Metadata = {
  title: 'AI Skill — gicons',
  description:
    'Give your AI assistant deep knowledge of gicons brand icons, patterns, and best practices.',
};

const FEATURES = [
  {
    title: 'Component Discovery',
    description:
      'Your assistant knows every available brand icon, naming conventions, and how to find the right component.',
  },
  {
    title: 'Framework-Aware',
    description:
      'Generates correct imports and usage for React, Vue, Svelte, Angular, and Web Components.',
  },
  {
    title: 'TailwindCSS & shadcn/ui',
    description:
      'Knows how to size, style, and compose icons with Tailwind classes and shadcn/ui components.',
  },
] as const;

const MANUAL_OPTIONS = [
  { name: 'Claude Code', file: 'CLAUDE.md', location: 'Project root' },
  { name: 'Cursor', file: '.cursorrules', location: 'Project root' },
  { name: 'GitHub Copilot', file: '.github/copilot-instructions.md', location: '.github/' },
  { name: 'Windsurf', file: '.windsurfrules', location: 'Project root' },
  { name: 'Universal', file: 'AGENTS.md', location: 'Works with most AI agents' },
] as const;

function getSkillContent(): string {
  const skillPath = resolve(process.cwd(), '../../skills/gicons/SKILL.md');
  return readFileSync(skillPath, 'utf-8');
}

export default function SkillPage() {
  const skillContent = getSkillContent();
  const installCommand = 'npx skills add gicons/gicons';

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI Skill</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">
          Give your AI assistant deep knowledge of gicons components, patterns, and best practices.
          When installed, your assistant knows how to find, install, and use any brand icon.
        </p>
      </div>

      {/* Install command */}
      <section className="mb-12">
        <h2 className="mb-3 text-xl font-semibold">Install</h2>
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
          <pre className="overflow-x-auto bg-gray-900 px-6 py-4 text-sm text-gray-100">
            <code>{installCommand}</code>
          </pre>
          <div className="absolute right-3 top-3">
            <CopyButton content={installCommand} variant="dark" />
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-500">
          This installs the gicons skill into your project. Once installed, your AI assistant
          automatically loads it when working with brand icons.{' '}
          <a
            href="https://skills.sh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 underline hover:text-gray-900"
          >
            Learn more about skills
          </a>
          .
        </p>
      </section>

      {/* What's Included */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">What&apos;s included</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-lg border border-gray-200 p-4">
              <h3 className="font-medium text-gray-900">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-600">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">How it works</h2>
        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              1
            </span>
            <span>
              <strong>Detection</strong> — The skill activates when your assistant encounters brand icon
              needs in your project.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              2
            </span>
            <span>
              <strong>Context injection</strong> — It provides the assistant with naming conventions,
              available icons, framework-specific patterns, and API references.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium">
              3
            </span>
            <span>
              <strong>Code generation</strong> — The assistant generates correct imports, props, and
              Tailwind/shadcn-compatible usage on the first try.
            </span>
          </li>
        </ol>
      </section>

      {/* Manual install */}
      <section className="mb-12">
        <h2 className="mb-3 text-xl font-semibold">Manual install</h2>
        <p className="mb-4 text-sm text-gray-600">
          Alternatively, copy the skill content below into the right file for your assistant:
        </p>
        <div className="mb-6 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">AI Assistant</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">File</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MANUAL_OPTIONS.map((a) => (
                <tr key={a.name}>
                  <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{a.file}</code>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Skill content */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Skill content</h2>
          <CopyButton content={skillContent} variant="light" label="Copy skill" />
        </div>
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <pre className="max-h-[600px] overflow-auto bg-gray-50 p-6 text-sm leading-relaxed text-gray-800">
            <code>{skillContent}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
