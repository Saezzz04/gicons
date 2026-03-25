'use client';

interface SvgPreviewProps {
  svgContent: string;
  filename: string;
  valid: boolean;
  errors?: string[];
}

export function SvgPreview({ svgContent, filename, valid, errors }: SvgPreviewProps) {
  return (
    <div className="rounded-lg border border-gray-200 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">{filename}</span>
        <span className={`text-xs ${valid ? 'text-green-600' : 'text-red-600'}`}>
          {valid ? 'Valid' : 'Invalid'}
        </span>
      </div>
      {valid && svgContent ? (
        <div className="flex items-center justify-center rounded bg-gray-50 p-4">
          <img
            role="img"
            alt={`Preview of ${filename}`}
            className="h-12 max-w-full"
            src={`data:image/svg+xml;base64,${btoa(svgContent.replace('<svg', '<svg style="height:100%;width:auto"'))}`}
          />
        </div>
      ) : (
        <div className="rounded bg-red-50 p-2">
          {errors?.map((e) => (
            <p key={e} className="text-xs text-red-600">{e}</p>
          ))}
        </div>
      )}
    </div>
  );
}
