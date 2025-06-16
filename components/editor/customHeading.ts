/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// CustomHeading.ts
import { Heading } from '@tiptap/extension-heading'
import { mergeAttributes } from '@tiptap/core'

export type Level = 1 | 2 | 3 | 4 | 5 | 6

// Extend the original heading to add class support with a different name
export const CustomHeading = Heading.extend({
  name: 'customHeading', // Different name to avoid conflicts

  addAttributes() {
    return {
      ...this.parent?.(),
      class: {
        default: null,
        parseHTML: element => element.getAttribute('class'),
        renderHTML: attributes => {
          if (!attributes.class) {
            return {}
          }
          return {
            class: attributes.class,
          }
        },
      },
    }
  },

  addCommands() {
    return {
      setCustomHeading: (attributes: { level: Level } & Record<string, any>) => ({ commands }) => {
        if (!this.options.levels.includes(attributes.level)) {
          return false
        }

        return commands.setNode(this.name, attributes)
      },
      toggleCustomHeading: (attributes: { level: Level } & Record<string, any>) => ({ commands }) => {
        if (!this.options.levels.includes(attributes.level)) {
          return false
        }

        return commands.toggleNode(this.name, 'paragraph', attributes)
      },
    }
  },
})

// Module augmentation for TypeScript with different command names
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customHeading: {
      setCustomHeading: (attributes: { level: Level } & Record<string, any>) => ReturnType,
      toggleCustomHeading: (attributes: { level: Level } & Record<string, any>) => ReturnType,
    }
  }
}