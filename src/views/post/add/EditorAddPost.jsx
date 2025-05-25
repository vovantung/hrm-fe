import React, { useEffect, useState } from 'react'

// import Router from 'next/router.js'

import { StarterKit } from '@tiptap/starter-kit'

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { Image } from '@tiptap/extension-image'
import { Dropcursor } from '@tiptap/extension-dropcursor'
import { ReactNodeViewRenderer, EditorContent, useEditor } from '@tiptap/react'

import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'

// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'

// import { useEffect, useState } from 'react'
// import CodeBlockComponent from 'src/views/codeblock/CodeBlockComponent'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)

import { Heading } from '@tiptap/extension-heading'
import { TextAlign } from '@tiptap/extension-text-align'

import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'

// import StarterKit from '@tiptap/starter-kit'

// import { content } from './content.js'
import { Link } from '@tiptap/extension-link'

import { Youtube } from '@tiptap/extension-youtube'

import { Icon } from '@iconify/react'
import { Button } from '@mui/material'
import { useSelector } from 'react-redux'

// import CustomTextField from 'src/@core/components/mui/text-field/index.tsx'

import { blue } from '@mui/material/colors'
import { styled, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CustomTextField from '@core/components/mui/TextField'

import { content } from './content.js'

import { FontSize } from '../FontSize.js'
import CodeBlockComponent from '../CodeBlockComponent.jsx'

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
  const [height, setHeight] = React.useState(480)
  const [width, setWidth] = React.useState(640)
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  if (!editor) {
    return null
  }

  const addYoutubeVideo = () => {
    const url = prompt('Enter YouTube url')

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(width, 10)) || 640,
        height: Math.max(180, parseInt(height, 10)) || 480
      })
    }
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

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()

      return
    }

    // update link
    try {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    } catch (e) {
      alert(e.message)
    }
  }

  if (!editor) {
    return null
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

      <div className='rdw-option-wrapper' title='Color'>
        <input
          id='width'
          type='number'
          min='320'
          max='1024'
          placeholder='width'
          value={width}
          onChange={event => setWidth(event.target.value)}
        />
      </div>
      <div className='rdw-option-wrapper' title='Color'>
        <input
          id='height'
          type='number'
          min='180'
          max='720'
          placeholder='height'
          value={height}
          onChange={event => setHeight(event.target.value)}
        />
      </div>

      <div className='rdw-option-wrapper' aria-selected='false' title='Video' id='add' onClick={addYoutubeVideo}>
        <Icon icon='octicon:video-16' />
      </div>

      <div className='rdw-option-wrapper' aria-selected='false' title='Image' onClick={addImage}>
        <Icon icon='garden:image-stroke-12' />
      </div>

      <div className='rdw-option-wrapper' aria-selected='false' title='Link' id='link' onClick={setLink}>
        <Icon icon='rivet-icons:link' />
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

const EditorAddPost = () => {
  const [body, setBody] = useState(null)
  const [title, setTitle] = useState(null)

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
      Dropcursor,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        isAllowedUri: (url, ctx) => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

            // use default validation
            if (!ctx.defaultValidate(parsedUrl.href)) {
              return false
            }

            // disallowed protocols
            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
              return false
            }

            // only allow protocols specified in ctx.protocols
            const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

            if (!allowedProtocols.includes(protocol)) {
              return false
            }

            // disallowed domains
            const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
              return false
            }

            // all checks have passed
            return true
          } catch {
            return false
          }
        },
        shouldAutoLink: url => {
          try {
            // construct URL
            const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

            // only auto-link if the domain is not in the disallowed list
            const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
          } catch {
            return false
          }
        }
      })
    ],
    content,
    editorProps: {
      attributes: {
        spellcheck: 'false'
      }
    }
  })

  const store = useSelector(state => state.customReducer)

  useEffect(() => {
    if (!editor) {
      return undefined
    }

    // Get the initial content …
    setBody(editor.getHTML())

    // … and get the content after every change.
    editor.on('update', () => {
      setBody(editor.getHTML())
    })
  }, [editor])

  const handleSave = async () => {
    try {
      const r = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          post: {
            title: title,
            content: body,
            account: { id: 1 }
          }
        })
      }

      await fetch(store.url + '/post/create-or-update', r)
      alert('Added a post')
    } catch (error) {
      // Router.replace('/pages/misc/500-server-error')
    }
  }

  const handTitleOnChange = e => {
    setTitle(e.target.value)
  }

  return (
    <div style={{ marginBottom: '14px', marginTop: '0px' }}>
      <span style={{ fontSize: '22px', color: '#444' }}>
        <strong>New post</strong>
      </span>
      <hr style={{ border: 'none', borderBottom: '1px solid #d1d1d1' }} />
      <span style={{ fontSize: '16px', color: '#555' }}>
        <strong>Title</strong>
      </span>
      <br />
      <span style={{ fontSize: '13px', color: '#555' }}>
        e specific and imagine you’re asking a question to another person.
      </span>

      <CustomTextField fullWidth id='outlined-full-width' sx={{ mb: 4 }} onChange={handTitleOnChange} />
      {/* <Text></Text> */}

      <span style={{ fontSize: '16px', color: '#555' }}>
        <strong>Body</strong>
      </span>
      <br />
      <span style={{ fontSize: '13px', color: '#555' }}>
        The body of your question contains your problem details and results. Minimum 220 characters.
      </span>

      <div style={{ marginBottom: '14px', border: 'solid 1px #ddd', borderRadius: '4px' }}>
        <MenuBar editor={editor} />
        <EditorContent editor={editor} className='editor-content' />
      </div>

      <CustomButton variant='contained' color='secondary' onClick={handleSave}>
        Post your ask
      </CustomButton>
    </div>
  )
}

export default EditorAddPost
