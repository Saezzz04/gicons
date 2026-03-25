'use client';

interface DownloadButtonProps {
  svgContent: string;
  filename: string;
}

export function DownloadButton({ svgContent, filename }: DownloadButtonProps) {
  const downloadSvg = () => {
    const fullSvg = svgContent.includes('xmlns')
      ? svgContent
      : svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    const blob = new Blob([fullSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadSvg}
      className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
    >
      Download SVG
    </button>
  );
}
