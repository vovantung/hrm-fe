'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { Card } from '@mui/material'

import { useSettings } from '@/@core/hooks/useSettings'

import SidebarAccount1 from '@/views/admin/SidebarAccount1'
import SidebarAccount2 from '@/views/admin/SidebarAccount2'

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
      <div>
        <div
          style={{
            position: 'fixed',
            top: settings.layout == 'horizontal' ? '115px' : '76px',
            width: '420px',
            left: left,
            zIndex: 999,
            transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
            transform: isVisible ? 'translateY(0)' : 'translateY(-56px)'
          }}
        >
          <div
            style={{
              position: 'fixed',
              top: '0px',
              left: left,
              width: '420px',
              zIndex: 9999
            }}
          >
            {/* Card thực sự: có background + shadow */}
            <Card
              style={{
                marginTop: '20px',
                marginBottom: '20px',
                marginLeft: '24px',
                marginRight: '24px',
                paddingTop: '20px',
                paddingBottom: '20px'
              }}
            >
              <div
                style={{
                  overflowY: 'auto',
                  maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 240px)' : 'calc(100vh - 195px)',
                  minHeight: '110px'
                }}
              >
                <aside>
                  <SidebarAccount1 />
                  <SidebarAccount2 />
                </aside>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            paddingRight: '396px',
            top: settings.layout == 'horizontal' ? '115px' : '76px',
            width: '100%',
            zIndex: 999,
            transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
            transform: isVisible ? 'translateY(0)' : 'translateY(-56px)'
          }}
        >
          <div
            style={{
              position: 'fixed',
              width: '100%',
              paddingRight: '396px'
            }}
          >
            <Card style={{}}>
              <div
                style={{
                  maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 200px)' : 'calc(100vh - 150px)',
                  minHeight: '150px'
                }}
              >
                <aside>
                  <main>{children}</main>
                </aside>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>
      <main>{children}</main>
    </>
  )
}
