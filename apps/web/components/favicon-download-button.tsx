'use client';

interface FaviconDownloadButtonProps {
  filename: string;
  base64: string;
  size: string;
}

export function FaviconDownloadButton({ filename, base64, size }: FaviconDownloadButtonProps) {
  const download = () => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: 'image/png' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={download}
      className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-3 transition-colors hover:border-gray-400 hover:bg-gray-50"
    >
      <img
        src={`data:image/png;base64,${base64}`}
        alt={filename}
        className="h-8 w-8 object-contain"
      />
      <span className="text-xs text-gray-600">{size}</span>
    </button>
  );
}
