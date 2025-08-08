'use client'

import { useEffect, useState } from 'react'

import { redirect, usePathname } from 'next/navigation'

import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'
import { getLocalizedUrl } from '@/utils/i18n'
import themeConfig from '@/configs/themeConfig'

export default function AuthGuardTXU({ children, locale }: ChildrenType & { locale: Locale }) {
  const [role, setRole] = useState<string>('')
  const pathname = usePathname()
  const allowed_post = ['admin', 'hrm']
  const allowed_admin = ['admin']

  const redirectUrl = `/${locale}/logintxu?redirectTo=${pathname}`
  const login = `/${locale}/logintxu`
  const homePage = getLocalizedUrl(themeConfig.homePageUrl, locale)

  useEffect(() => {
    loadItems()
  }, [])

  async function loadItems() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const r = {
        method: 'GET',
        headers: {
          Authorization: auth
        }
      }

      const response = await fetch('https://backend.txuapp.com/get-role', r)

      const result = await response.json()

      if (result !== undefined) {
        // alert(result.role)
        setRole(result.role)
      }
    } catch (exception) {
      setRole('user')
    }
  }

  if (role) {
    if (pathname.substring(4, 9) == 'admin' && !allowed_admin.includes(role)) {
      redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
    } else if (pathname.substring(4, 8) == 'post' && !allowed_post.includes(role)) {
      redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
    } else {
      return <>{children}</>
    }
  }
}
