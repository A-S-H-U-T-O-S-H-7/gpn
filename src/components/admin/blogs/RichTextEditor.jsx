"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Bold, Italic, List, ListOrdered, Undo, Redo, Heading1, Heading2 } from 'lucide-react';

const MenuBar = ({ editor, isDark }) => {
  if (!editor) return null;

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), isActive: editor.isActive('bold'), label: 'Bold' },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), isActive: editor.isActive('italic'), label: 'Italic' },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), isActive: editor.isActive('bulletList'), label: 'Bullet List' },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), isActive: editor.isActive('orderedList'), label: 'Numbered List' },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: editor.isActive('heading', { level: 1 }), label: 'Heading 1' },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: editor.isActive('heading', { level: 2 }), label: 'Heading 2' },
  ];

  return (
    <div className={`flex flex-wrap gap-1 p-2 border-b ${isDark ? "border-rose-500/50" : "border-rose-300"}`}>
      {buttons.map(({ icon: Icon, action, isActive, label }) => (
        <button
          key={label}
          onClick={action}
          className={`p-1.5 rounded transition-colors ${
            isActive
              ? isDark ? "bg-red-500/20 text-red" : "bg-red-100 text-red"
              : isDark ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </button>
      ))}
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className={`p-1.5 rounded transition-colors disabled:opacity-50 ${
          isDark ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className={`p-1.5 rounded transition-colors disabled:opacity-50 ${
          isDark ? "text-gray-400 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder, isDark }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: placeholder || 'Write your content here...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose max-w-none min-h-[300px] px-4 py-3 focus:outline-none ${isDark ? 'text-white' : 'text-gray-900'}`,
      },
    },
  });

  return (
    <div className={`rounded-lg border overflow-hidden ${isDark ? "border-rose-500/60" : "border-rose-300"}`}>
      <MenuBar editor={editor} isDark={isDark} />
      <EditorContent editor={editor} />
    </div>
  );
}
