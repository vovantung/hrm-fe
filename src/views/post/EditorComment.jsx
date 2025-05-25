import React, { useEffect, useState } from 'react'

import { Router } from 'next/router.js'

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Image from '@tiptap/extension-image'
import Dropcursor from '@tiptap/extension-dropcursor'
import { ReactNodeViewRenderer, EditorContent, useEditor } from '@tiptap/react'

import StarterKit from '@tiptap/starter-kit'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

// import { useEffect, useState } from 'react'
// import CodeBlockComponent from 'src/views/post/CodeBlockComponent'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'

import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'

// import StarterKit from '@tiptap/starter-kit'

// import { content } from './content.js'

import Youtube from '@tiptap/extension-youtube'

import { Icon } from '@iconify/react'

import { Button } from '@mui/material'

// import { useSelector } from 'react-redux'

import { blue } from '@mui/material/colors'

import { styled, useTheme } from '@mui/material/styles'

import useMediaQuery from '@mui/material/useMediaQuery'

import { FontSize } from './FontSize.js'
import CodeBlockComponent from './CodeBlockComponent.jsx'

// import Router from 'next/router.js'

// Styled component for a custom button
const CustomButton = styled(Button)(({ theme }) => ({
  backgroundColor: blue[700],
  color: theme.palette.getContrastText(blue[500]),
  '&:hover': {
    backgroundColor: blue[600]
  }
}))

export { CustomButton }

const MenuBar = ({ editor }) => {
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  if (!editor) {
    return null
  }

  const addImage = () => {
    const url = prompt('Enter image url')

    if (url) {
      editor
        .chain()
        .focus()
        .setImage({
          src: url
        })
        .run()
    }
  }

  const setFontSize = event => {
    // const size = event.target.value
    editor.chain().focus().setFontSize(event).run()
  }

  return (
    <div className={lgAbove ? 'rdw-inline-wrapper' : 'menubar-wraper'}>
      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Bold'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Icon icon='fontisto:bold' />
      </div>
      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Italic'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Icon icon='garden:italic-fill-12' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Strike'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Icon icon='fa:strikethrough' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Code'
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Icon icon='jam:code' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Paragraph'
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        <Icon icon='mingcute:paragraph-fill' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Bullet List'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <Icon icon='streamline:bullet-list-solid' />
      </div>
      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Ordered List'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <Icon icon='mingcute:list-ordered-fill' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Code Block'
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Icon icon='ph:code-block-bold' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Block quote'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Icon icon='hugeicons:left-to-right-block-quote' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Horizontal Rule'
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Icon icon='codicon:horizontal-rule' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Break'
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        <Icon icon='tabler:page-break' />
      </div>

      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Undo'
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Icon icon='material-symbols:undo' />
      </div>
      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Redo'
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Icon icon='material-symbols:redo' />
      </div>
      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Left'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <Icon icon='mingcute:align-left-fill' />
      </div>
      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Center'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <Icon icon='mingcute:align-center-fill' />
      </div>
      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Right'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <Icon icon='mingcute:align-right-fill' />
      </div>
      <div
        className='rdw-option-wrapper'
        aria-selected='false'
        title='Right'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <Icon icon='mingcute:align-justify-fill' />
      </div>
      <div className='rdw-option-wrapper' title='Color'>
        <input
          style={{ width: '30px' }}
          type='color'
          onInput={event => editor.chain().focus().setColor(event.target.value).run()}
          value={editor.getAttributes('textStyle').color}
          data-testid='setColor'
        />
      </div>

      <div className='rdw-option-wrapper' aria-selected='false' title='Image' onClick={addImage}>
        <Icon icon='garden:image-stroke-12' />
      </div>
      <div className='rdw-option-wrapper' title='Font size'>
        <select onChange={e => setFontSize(e.target.value)} defaultValue='16'>
          <option value='10'>10</option>
          <option value='11'>11</option>
          <option value='12'>12</option>
          <option value='13'>13</option>
          <option value='14'>14</option>
          <option value='15'>15</option>
          <option value='16'>16</option>
          <option value='17'>17</option>
          <option value='18'>18</option>
          <option value='19'>19</option>
          <option value='20'>20</option>
          <option value='21'>21</option>
          <option value='22'>22</option>
          <option value='23'>23</option>
          <option value='24'>24</option>
          <option value='25'>25</option>
        </select>
      </div>
    </div>
  )
}

const EditorComment = ({ id, callback }) => {
  const [html, setHtml] = useState(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      TextStyle,
      FontSize,
      Color,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent)
        }
      }).configure({ lowlight }),
      Heading,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Youtube.configure({
        controls: false,
        nocookie: true
      }),
      Image.extend({
        addAttributes() {
          return {
            src: {},
            alt: { default: null },
            title: { default: null },
            class: { default: 'responsive-img' } // Thêm class mặc định cho ảnh, giúp xử lý hiển thị ảnh trên trang với css theo class
          }
        }
      }),
      Dropcursor
    ],
    content: '',
    editorProps: {
      attributes: {
        spellcheck: 'false'
      }
    }
  })

  // const store = useSelector(state => state.custom)

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    // Get the initial content …
    setHtml(editor.getHTML())

    // … and get the content after every change.
    editor.on('update', () => {
      setHtml(editor.getHTML())
    })
  }, [editor, id])

  const handleSave = async () => {
    try {
      const r = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment: {
            user: { id: '2c9e80818e69d39b018e69d3d2ee0000' },
            post: {
              id: id
            },
            content: html
          }
        })
      }

      await fetch('https://a968-2402-800-6340-186f-1f6-209a-22cd-3ccd.ngrok-free.app' + '/comment/create-or-update', r)

      // alert('Added a comment')
      callback()
    } catch (error) {
      Router.replace('/pages/misc/500-server-error')
    }
  }

  return id ? (
    <div style={{ marginBottom: '14px', marginTop: '10px' }}>
      <div style={{ marginBottom: '14px', border: 'solid 1px #ddd', borderRadius: '4px' }}>
        <div style={{ width: '100%' }}>
          <MenuBar editor={editor} />
        </div>

        <EditorContent editor={editor} className='editor-content' />
      </div>

      <CustomButton variant='contained' onClick={handleSave}>
        Post your answer
      </CustomButton>
    </div>
  ) : null
}

export default EditorComment
