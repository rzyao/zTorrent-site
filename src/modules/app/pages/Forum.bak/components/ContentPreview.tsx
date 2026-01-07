// @ts-nocheck
import { memo } from 'react';

export const ContentPreview = memo(function ContentPreview({ html }: { html: string }) {
  return (
    <div
      className="bg-neutral-900/40 rounded-lg p-6 text-neutral-300 leading-relaxed mb-6 prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

export const ReplyContent = memo(function ReplyContent({ html }: { html: string }) {
  return (
    <div
      className="text-neutral-300 text-sm leading-relaxed mb-3 prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});

