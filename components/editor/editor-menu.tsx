import { EditorBubble, useEditor } from 'novel'
import { removeAIHighlight } from 'novel'

import { type ReactNode, useEffect } from 'react'

interface EditorMenuProps {
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function EditorMenu({
  children,
  open,
  onOpenChange
}: EditorMenuProps) {
  const { editor } = useEditor()

  useEffect(() => {
    if (!editor) return
    if (!open) removeAIHighlight(editor)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? 'bottom-start' : 'top',
        onHidden: () => {
          onOpenChange(false)
          editor?.chain().unsetHighlight().run()
        }
      }}
      className='flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-muted bg-background shadow-xl'
    >
      {!open && children}
    </EditorBubble>
  )
}