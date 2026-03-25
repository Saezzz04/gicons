'use client';

import type { Message } from 'ai';
import { SvgPreview } from './svg-preview';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
          isUser
            ? 'bg-gray-900 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}

        {message.parts?.map((part) => {
          if (part.type === 'tool-invocation') {
            const { toolInvocation } = part;
            const { toolName, state } = toolInvocation;

            if (state === 'call') {
              return (
                <p key={toolInvocation.toolCallId} className="text-xs italic text-gray-500">
                  {toolName === 'web_search' && 'Searching the web...'}
                  {toolName === 'search_brand_assets' && 'Searching for brand assets...'}
                  {toolName === 'download_and_validate_svg' && 'Downloading and validating SVG...'}
                  {toolName === 'create_brand_pr' && 'Creating pull request...'}
                  {toolName === 'check_existing_brand' && 'Checking if brand exists...'}
                </p>
              );
            }

            if (state === 'result') {
              const result = toolInvocation.result as Record<string, unknown>;

              if (toolName === 'download_and_validate_svg' && result.svgContent) {
                return (
                  <div key={toolInvocation.toolCallId} className="mt-2">
                    <SvgPreview
                      svgContent={result.svgContent as string}
                      filename={result.filename as string}
                      valid={result.valid as boolean}
                      errors={result.errors as string[] | undefined}
                    />
                  </div>
                );
              }

              if (toolName === 'create_brand_pr' && result.success) {
                return (
                  <div key={toolInvocation.toolCallId} className="mt-2 rounded-lg bg-green-50 p-3">
                    <p className="text-sm font-medium text-green-800">PR created successfully!</p>
                    <a
                      href={result.prUrl as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-green-700 underline"
                    >
                      View PR #{result.prNumber as number}
                    </a>
                  </div>
                );
              }

              if (toolName === 'web_search' && (result.count as number) > 0) {
                return (
                  <p key={toolInvocation.toolCallId} className="mt-1 text-xs text-gray-500">
                    Found {result.count as number} result{(result.count as number) !== 1 ? 's' : ''} for &quot;{result.query as string}&quot;
                  </p>
                );
              }

              if (toolName === 'check_existing_brand' && result.exists) {
                return (
                  <p key={toolInvocation.toolCallId} className="mt-1 text-xs text-amber-600">
                    Brand &quot;{result.slug as string}&quot; already exists in the library.
                  </p>
                );
              }
            }
          }
          return null;
        })}
      </div>
    </div>
  );
}
