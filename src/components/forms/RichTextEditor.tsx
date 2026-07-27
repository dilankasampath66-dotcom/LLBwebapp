'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] w-full bg-zinc-950 border border-zinc-800 rounded-b-md px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-maroon-500 focus:border-maroon-500 prose prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 max-w-none',
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const MenuBar = () => {
    return (
      <div className="flex flex-wrap items-center gap-1 border border-zinc-800 border-b-0 bg-zinc-900 px-3 py-2 rounded-t-md">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={cn(
            'p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors',
            editor.isActive('bold') && 'bg-zinc-800 text-zinc-100'
          )}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={cn(
            'p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors',
            editor.isActive('italic') && 'bg-zinc-800 text-zinc-100'
          )}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className="w-px h-5 bg-zinc-700 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            'p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors',
            editor.isActive('bulletList') && 'bg-zinc-800 text-zinc-100'
          )}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            'p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors',
            editor.isActive('orderedList') && 'bg-zinc-800 text-zinc-100'
          )}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <MenuBar />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #52525b; /* zinc-600 */
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
