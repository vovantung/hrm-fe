'use client'
import { useEffect, useState } from 'react'

// import { useParams } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

// import PreviewPage from '@views/post/PageReview'
import AskQuestion from '@views/post/AskQuestion'

import EditorAddPost from '@views/post/add/EditorAddPost'

const AddPost = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  const handleScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }

    setLastScrollY(window.scrollY)
  }

  useEffect(() => {
    // if (!id) return
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return lgAbove ? (
    <div>
      <div
        style={{
          position: 'fixed',
          top: '116px',
          width: '400px',
          maxHeight: 'calc(100vh - 50px)',
          overflowY: 'auto',
          left: 'calc(100% - 400px  - max(0px, (100% - 1440px) / 2))',
          zIndex: 999,
          transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
          transform: isVisible ? 'translateY(0)' : 'translateY(-56px)'
        }}
      >
        <AskQuestion></AskQuestion>
      </div>
      <div
        style={{
          paddingRight: '376px'
        }}
      >
        <EditorAddPost />
      </div>
    </div>
  ) : (
    <EditorAddPost />
  )
}

export default AddPost
