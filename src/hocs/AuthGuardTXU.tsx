'use client'

import { useEffect, useState } from 'react'

import { redirect, usePathname } from 'next/navigation'

import { useDispatch, useSelector } from 'react-redux'

import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'
import { getLocalizedUrl } from '@/utils/i18n'
import themeConfig from '@/configs/themeConfig'
import { setUserLogined } from '@/redux-store/slices/accounts'
import { setAuth } from '@/redux-store/slices/auth'

export default function AuthGuardTXU({ children, locale }: ChildrenType & { locale: Locale }) {
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  const dispatch = useDispatch()
  const [role, setRole] = useState<string>('')
  const pathname = usePathname()
  const allowed_post = ['admin', 'hrm']
  const allowed_admin = ['admin']

  const redirectUrl = `/${locale}/logintxu?redirectTo=${pathname}`
  const login = `/${locale}/logintxu`
  const homePage = getLocalizedUrl(themeConfig.homePageUrl, locale)

  useEffect(() => {
    initData()

    // if (role !== '') {
    //   getUserLogined()
    // }
  }, [])

  async function initData() {
    try {
      const auth_ = localStorage.getItem('Authorization') as string

      const r = {
        method: 'GET',
        headers: {
          Authorization: auth_
        }
      }

      const response = await fetch(globalVariables.url + '/get-role', r)

      const result = await response.json()

      if (result !== undefined) {
        setRole(result.role)
        getUserLogined()

        // if (result.role != '') {
        //   getUserLogined()
        // }
      }
    } catch (exception) {
      setRole('user')
    }
  }

  async function getUserLogined() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'GET',
        headers: {
          Authorization: auth
        }
      }

      // Lấy số đơn vị chưa upload báo cáo trong khoảng thời gian from-to
      const res = await fetch(globalVariables.url_admin + '/account/get-current-user', p)

      if (!res.ok) {
        return
      }

      const userLogin = await res.json()

      if (userLogin !== undefined) {
        dispatch(setUserLogined(userLogin))
        dispatch(setAuth({ token: auth }))
      }
    } catch (exception) {
      // route.replace('/pages/misc/500-server-error')
    }
  }

  if (role) {
    if (pathname.substring(4, 9) == 'admin' && !allowed_admin.includes(role)) {
      redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
    } else if (pathname.substring(4, 8) == 'post' && !allowed_post.includes(role)) {
      redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
    } else {
      // Ngăn việc return sớm khi auto.toke chưa nhận giá trị
      // if (auth.token != '') return <>{children}</>
      if (auth.token != '') {
        return <>{children}</>
      } else {
        alert('sớm')
      }
    }
  }
}
