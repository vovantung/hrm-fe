'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useSettings } from '@/@core/hooks/useSettings'

import SidebarAccount1 from '@/views/admin/SidebarAccount1'
import SidebarAccount2 from '@/views/admin/SidebarAccount2'

export default function PostLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings()

  const left =
    settings.contentWidth === 'compact'
      ? 'calc(100% - 420px - max(0px, (100% - 1440px) / 2))'
      : 'calc(100% - 420px  - max(0px, (-100%) / 2))'

  // const isCompact = settings.contentWidth === 'compact'

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

  // if (!id) return <p>Loading...</p>

  return lgAbove ? (
    <div>
      <div>
        <div
          style={{
            position: 'fixed',
            top: settings.layout == 'horizontal' ? '110px' : '76px',
            width: '420px',
            left: left,
            zIndex: 999,
            transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
            transform: isVisible ? 'translateY(0)' : 'translateY(-56px)'
          }}
        >
          <div
            style={{
              paddingTop: '24px'
            }}
          ></div>
          <div
            style={{
              maxHeight: 'calc(100vh - 190px)',
              overflowY: 'auto',
              width: '100%'
            }}
          >
            <aside>
              <SidebarAccount1 />
              <SidebarAccount2 />
            </aside>
          </div>
        </div>
      </div>
      <div
        style={{
          paddingRight: '396px'
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
