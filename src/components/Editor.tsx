'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import {
  Bold,
  ImageIcon,
  Italic,
  List,
  ListOrdered,
  Quote,
  UnderlineIcon,
} from 'lucide-react'

type EditorProps = {
  value?: any
  onChange?: (value: any) => void
}

const Editor = ({ value, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({
        placeholder: "Type '/' for commands…",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'tiptap prose-base focus:outline-none min-h-[240px] block w-full',
      },
    },
    immediatelyRender: false,
    content: value || '',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      onChange?.(json)
    },
  })

  // Keep TipTap content in sync when external value changes
  useEffect(() => {
    if (!editor) return
    if (!value) {
      // if cleared outside
      editor.commands.clearContent()
      return
    }
    try {
      // Prevent unnecessary updates by comparing JSON stringified
      const current = JSON.stringify(editor.getJSON())
      const incoming = typeof value === 'string' ? value : JSON.stringify(value)
      if (incoming !== current) {
        editor.commands.setContent(value)
      }
    } catch {
      // Fallback to setContent if comparison fails
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className="relative">
      {/* Bubble menu (выделение текста) */}
      <BubbleMenu
        editor={editor!}
        className="flex gap-2 bg-black/80 text-white p-1 rounded-lg"
      >
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={
            editor?.isActive('bold') ? 'font-bold text-yellow-400' : ''
          }
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive('italic') ? 'italic text-yellow-400' : ''}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={
            editor?.isActive('underline') ? 'underline text-yellow-400' : ''
          }
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={editor?.isActive('blockquote') ? 'text-yellow-400' : ''}
        >
          <Quote size={16} />
        </button>
      </BubbleMenu>

      {/* Floating menu (меню при / или начале строки) */}
      <FloatingMenu
        editor={editor}
        className="flex gap-2 bg-white p-2 rounded-xl shadow-lg"
      >
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List size={16} />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={16} />
        </button>
        <button
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setImage({ src: window.prompt('Image URL') || '' })
              .run()
          }
        >
          <ImageIcon size={16} />
        </button>
      </FloatingMenu>

      {/* Само поле редактора */}
      <EditorContent
        editor={editor}
        className="tiptap prose dark:prose-invert max-w-none min-h-[300px]"
      />
    </div>
  )
}

function ToolbarButton({
  label,
  onClick,
  active,
}: {
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-pressable btn-active-shadow rounded-md px-2 py-1 transition-colors ${
        active
          ? 'bg-black text-white dark:bg-white dark:text-black'
          : 'hover:bg-black/5 dark:hover:bg-white/10'
      }`}
    >
      {label}
    </button>
  )
}

export default Editor
