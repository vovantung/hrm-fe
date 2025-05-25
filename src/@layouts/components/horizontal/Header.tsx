'use client'

// MUI Imports
import { useEffect, useState } from 'react'

import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import type { CSSObject } from '@emotion/styled'

// Type Imports
import type { ChildrenType } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

// Styled Component Imports
import StyledHeader from '@layouts/styles/horizontal/StyledHeader'
import useHorizontalNav from '@/@menu/hooks/useHorizontalNav'

type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const Header = (props: Props) => {
  // Props
  const { children, overrideStyles } = props

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()

  // Vars
  const { navbarContentWidth } = settings

  const headerFixed = themeConfig.navbar.type === 'fixed'
  const headerStatic = themeConfig.navbar.type === 'static'
  const headerBlur = themeConfig.navbar.blur === true
  const headerContentCompact = navbarContentWidth === 'compact'
  const headerContentWide = navbarContentWidth === 'wide'
  const { isBreakpointReached } = useHorizontalNav()

  // Bắt đầu xử lý ẩn hiện menu
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const handleScroll = () => {
    if (window.scrollY > lastScrollY && window.scrollY) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }

    setLastScrollY(window.scrollY)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <>
      <StyledHeader
        style={
          isBreakpointReached
            ? {}
            : {
                transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
                transform: isVisible ? 'translateY(0)' : 'translateY(-50%)'
              }
        }
        theme={theme}
        overrideStyles={overrideStyles}
        className={classnames(horizontalLayoutClasses.header, {
          [horizontalLayoutClasses.headerFixed]: headerFixed,
          [horizontalLayoutClasses.headerStatic]: headerStatic,
          [horizontalLayoutClasses.headerBlur]: headerBlur,
          [horizontalLayoutClasses.headerContentCompact]: headerContentCompact,
          [horizontalLayoutClasses.headerContentWide]: headerContentWide
        })}
      >
        {children}
      </StyledHeader>
    </>
  )
}

export default Header
