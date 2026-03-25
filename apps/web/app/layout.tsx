import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { ChatButton } from '@/components/chat/chat-button';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'gicons — Brand icons for every framework',
  description:
    'Open-source brand logo icons for React, Vue, Svelte, Angular, and Web Components. Browse, search, and download.',
  metadataBase: new URL('https://gicons.dev'),
  openGraph: {
    title: 'gicons — Brand icons for every framework',
    description: 'Open-source brand logo icons for React, Vue, Svelte, Angular, and Web Components.',
    type: 'website',
    url: 'https://gicons.dev',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'gicons',
  url: 'https://gicons.dev',
  description: 'Open-source brand logo icons for React, Vue, Svelte, Angular, and Web Components.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://gicons.dev/?q={search_term}',
    'query-input': 'required name=search_term',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <header className="border-b border-gray-200">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              gicons
            </Link>
            <nav aria-label="Main navigation" className="flex items-center gap-6 text-sm">
              <Link href="/skill" className="text-gray-600 hover:text-gray-900">
                AI Skill
              </Link>
              <a
                href="https://github.com/gicons/gicons"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
              <Link href="/docs" className="text-gray-600 hover:text-gray-900">
                Docs
              </Link>
            </nav>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
          <p>MIT License. Brand logos are trademarks of their respective owners.</p>
        </footer>
        <ChatButton />
      </body>
    </html>
  );
}
