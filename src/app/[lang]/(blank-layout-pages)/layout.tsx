// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import themeConfig from '@/configs/themeConfig'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

type Props = ChildrenType & {
  params: Promise<{ lang: Locale }>
}

const Layout = async (props: Props) => {
  const params = await props.params
  const { children } = props

  // Vars
  const direction = i18n.langDirection[params.lang]
  const systemMode = await getSystemMode()
  const layoutMode = themeConfig.layout

  return (
    <Providers direction={direction}>
      <BlankLayout systemMode={systemMode} layoutMode={layoutMode}>
        {children}
      </BlankLayout>
    </Providers>
  )
}

export default Layout
