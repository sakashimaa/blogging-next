import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { EditorContent } from '@tiptap/react'

export const BlogView = ({ content }: { content: any }) => {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'tiptap prose-base focus:outline-none min-h-[240px] block w-full',
      },
    },
    content,
  })

  return <EditorContent editor={editor} />
}
