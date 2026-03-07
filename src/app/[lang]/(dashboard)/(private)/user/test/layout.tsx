'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Card } from '@mui/material'

import { useSettings } from '@/@core/hooks/useSettings'

export default function PostLayout({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings()

  const left =
    settings.contentWidth === 'compact'
      ? settings.layout !== 'collapsed'
        ? settings.layout === 'horizontal'
          ? 'calc(100% - 420px - max(0px, (100% - 1440px) / 2))'
          : 'calc(100% - 420px - max(0px, (100% - 1440px - 260px) / 2))'
        : 'calc(100% - 420px - max(0px, (100% - 1440px - 70px) / 2))'
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
      {/* Content page */}
      <div
        style={{
          top: settings.layout == 'horizontal' ? '115px' : '76px',
          transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
          transform: isVisible ? 'translateY(0)' : 'translateY(-56px)'
        }}
      >
        <div
          style={{
            position: 'fixed',
            width: '100%',
            paddingRight: '396px',
            zIndex: 9999,
            maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 185px)' : 'calc(100vh - 135px)',
            minHeight: '150px'
          }}
        >
          <aside>
            <main>{children}</main>
          </aside>
        </div>
      </div>

      {/* Right sidebar */}
      <div
        style={{
          position: 'fixed',
          top: settings.layout == 'horizontal' ? '115px' : '76px',
          width: '420px',
          left: left,
          transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
          transform: isVisible ? 'translateY(0)' : 'translateY(-56px)'
        }}
      >
        <Card
          style={{
            marginTop: '20px',
            marginBottom: '20px',
            marginLeft: '24px',
            marginRight: '24px',
            paddingTop: '20px',
            paddingBottom: '20px',
            borderRadius: 2
          }}
        >
          <div
            style={{
              overflowY: 'auto',
              maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 233px)' : 'calc(100vh - 193px)',
              minHeight: settings.layout == 'horizontal' ? '147px' : '147px',
              height: settings.layout == 'horizontal' ? 'calc(100vh - 233px)' : 'calc(100vh - 193px)'
            }}
          >
            <aside>Sidebar</aside>
          </div>
        </Card>
      </div>

      <div
        id='toast-root'
        style={{
          zIndex: 99999 // cao hơn mọi sidebar
        }}
      />
    </div>
  ) : (
    <>
      <main>{children}</main>
    </>
  )
}
