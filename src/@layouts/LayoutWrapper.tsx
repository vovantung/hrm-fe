'use client'

// React Imports
import type { ReactElement } from 'react'

// Type Imports
import { useMediaQuery, useTheme } from '@mui/material'

import type { SystemMode } from '@core/types'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useLayoutInit from '@core/hooks/useLayoutInit'

type LayoutWrapperProps = {
  systemMode: SystemMode
  verticalLayout: ReactElement
  horizontalLayout: ReactElement

  // layout: Layout
}

const LayoutWrapper = (props: LayoutWrapperProps) => {
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  // Props
  const { systemMode, verticalLayout, horizontalLayout } = props

  // Hooks
  const { settings } = useSettings()

  useLayoutInit(systemMode)

  // Return the layout based on the layout context
  return (
    <div className='flex flex-col flex-auto' data-skin={settings.skin}>
      {settings.layout === 'horizontal' ? horizontalLayout : !lgAbove ? horizontalLayout : verticalLayout}
    </div>
  )
}

export default LayoutWrapper
