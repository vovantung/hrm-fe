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
  const [roles, setRoles] = useState<string[]>([])
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)
  const dispatch = useDispatch()
  const [initOk, setInitOk] = useState<boolean>(false)
  const pathname = usePathname()

  const redirectUrl = `/${locale}/logintxu?redirectTo=${pathname}`
  const login = `/${locale}/logintxu`
  const homePage = getLocalizedUrl(themeConfig.homePageUrl, locale)

  useEffect(() => {
    initData()
  }, [])

  async function initData() {
    const token = ('Bearer ' + localStorage.getItem('access_token')) as string

    dispatch(setAuth({ token: token }))

    try {
      const r = {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      }

      const res = await fetch(globalVariables.url_admin + '/current-user', r)

      if (!res.ok) {
        refresh_token()

        return
      }

      const data = await res.json()

      if (data !== undefined) {
        setRoles(data?.realm_access?.roles ?? [])
        dispatch(setUserLogined(data))

        // Lưu ý setInitOk(true), trạng thái kiểm tra sẽ kết thúc ngay sau đó và chuyển đến trang nghiệp vụ.
        setInitOk(true)
      }
    } catch (exception) {
      // Ở đây xảy các trương hợp
      // 1. Không tồn tại access token và refresh_token do bị xóa cache
      // 2. Khi refresh_token hoàn toàn hết hiệu lực để refresh token
      // 3. Khi refresh_token còn hiệu lực refresh token, nhưng access token không còn đi qua istio (vì gọi api /user-info tức gọi api introspect của keycloak)
      refresh_token()
    }
  }

  async function refresh_token() {
    alert('refresh_token')
    const refresh_token = localStorage.getItem('refresh_token') as string

    const r = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refresh_token: refresh_token
      })
    }

    try {
      const res = await fetch(globalVariables.url_auth + '/refresh-token', r)

      if (!res.ok) {
        setInitOk(true)
      }

      const data = await res.json()

      if (data !== undefined) {
        // Trương hợp refresh_token còn hiệu lực refresh
        localStorage.clear()
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        refresh()
      } else {
        setInitOk(true)
      }
    } catch (exception) {
      // Những trương hợp không tồn tại refresh_token và access_token, refresh_token hoàn toàn hết hiệu lực refresh
      setInitOk(true)
    }
  }

  async function refresh() {
    const token = ('Bearer ' + localStorage.getItem('access_token')) as string

    dispatch(setAuth({ token: token }))

    try {
      const r = {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        }
      }

      const res = await fetch(globalVariables.url_admin + '/current-user', r)

      if (!res.ok) {
        setInitOk(true)
      }

      const data = await res.json()

      if (data !== undefined) {
        setRoles(data?.realm_access?.roles ?? [])
        dispatch(setUserLogined(data))
        alert('Đã đặt lại token, role, user')
        setInitOk(true)

        // Refresh thành hoàn thành
      } else {
        setInitOk(true)
      }
    } catch (exception) {
      setInitOk(true)
    }
  }

  if (initOk) {
    // Kiểm tra các path admin và post với quyền (role), nếu hợp lệ thì cho qua, nếu không hợp lệ thì chuyển đến trang login.
    // Trang admin hoặc user, yêu cầu cần có roles phù hợp
    if (
      (pathname.substring(4, 9) == 'admin' && roles.includes('be-admin')) ||
      (pathname.substring(4, 8) == 'user' && (roles.includes('be-admin') || roles.includes('be-user')))
    ) {
      return <>{children}</>
    } else if (pathname.substring(4, 9) == 'admin' || pathname.substring(4, 8) == 'user') {
      // Trang admin hoặc user chưa đăng nhập
      redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
    } else {
      // Đến đây chỉ còn các path không cần role, không token và userLogin
      return <>{children}</>
    }
  }
}
