'use client';

import {
  headingsPlugin,
  MDXEditor as MDXEditorComponent,
  type MDXEditorMethods,
} from '@mdxeditor/editor';
import type { FC } from 'react';
import { cn } from '@/lib/utils';

interface EditorProps {
  markdown: string;
  onChange: (value: string) => void;
  editorRef?: React.RefObject<MDXEditorMethods | null>;
  className?: string;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const MDXEditor: FC<EditorProps> = ({
  markdown,
  onChange,
  editorRef,
  className,
}) => {
  return (
    <MDXEditorComponent
      className="w-full"
      contentEditableClassName={cn(
        'field-sizing-content flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
        className
      )}
      markdown={markdown}
      onChange={onChange}
      plugins={[headingsPlugin()]}
      ref={editorRef}
    />
  );
};

export default MDXEditor;
