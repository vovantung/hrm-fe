'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import AskQuestion from '@/views/post/AskQuestion'
import QuestionTag from '@/views/post/QuestionTag'
import RelatedPost from '@/views/post/RelatedPost'

export default function PostLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams()

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
    if (!id) return

    window.addEventListener('scroll', handleScroll)

    // return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, id])

  if (!id) return <p>Loading...</p>

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
        <aside>
          <AskQuestion></AskQuestion>
          <RelatedPost></RelatedPost>
          <QuestionTag></QuestionTag>
        </aside>
      </div>
      <div
        style={{
          paddingRight: '376px'
        }}
      >
        <main>{children}</main>
      </div>
    </div>
  ) : (
    <>
      <main>{children}</main>
    </>
  )
}
