import { Extension } from '@tiptap/core'

export const FontSize = Extension.create({
  name: 'fontSize',

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace('px', ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {}

              return { style: `font-size: ${attributes.fontSize}px` }
            }
          }
        }
      }
    ]
  },

  addCommands() {
    return {
      setFontSize:
        size =>
        ({ chain }) => {
          return chain()
            .setMark('textStyle', { fontSize: `${size}` })
            .run()
        }
    }
  }
})

const FS = () => {
  return <></>
}

export default FS
