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

// type AccountDataType = {
//   id: number
//   username: string
//   lastName: string
//   firstName: string
//   email: string
//   phoneNumber: string
//   avatar: string
//   newpassword: string
// }

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

type AccountDataType = {
  id: number
  username: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  role: RoleDataType
  avatarUrl: string
  avatarFilename: string
  department: DepartmentDataType
  newpassword: string
}

type RoleDataType = {
  id: number
  name: string
  createdAt: string
  updateAt: string
}

export default function AuthGuardTXU({ children, locale }: ChildrenType & { locale: Locale }) {
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  // const userLogined = useSelector((state: any) => state.accounts.userLogined) as AccountDataType

  const dispatch = useDispatch()
  const [role, setRole] = useState<string>('')
  const pathname = usePathname()
  const allowed_user = ['admin', 'hrm', 'user']
  const allowed_admin = ['admin']

  // const auth_ = localStorage.getItem('Authorization') as string

  const redirectUrl = `/${locale}/logintxu?redirectTo=${pathname}`
  const login = `/${locale}/logintxu`
  const homePage = getLocalizedUrl(themeConfig.homePageUrl, locale)

  const [auth_, setAuth_] = useState<string>()
  const userLogined = useSelector((state: any) => state.accounts.userLogined) as AccountDataType

  useEffect(() => {
    initData()
  }, [])

  async function initData() {
    const token = localStorage.getItem('Authorization') as string

    setAuth_(token)
    dispatch(setAuth({ token: token }))

    try {
      // const auth = localStorage.getItem('Authorization') as string

      const r = {
        method: 'GET',
        headers: {
          Authorization: token
        }
      }

      // const res = await fetch(globalVariables.url + '/get-role', r)

      const res = await fetch(globalVariables.url_auth + '/get-role', r)

      if (!res.ok) {
        // const resError = await res.json()
        setRole('guest')
      }

      const result = await res.json()

      if (result !== undefined) {
        setRole(result.role)
        getUserLogined()
      }
    } catch (exception) {
      setRole('guest')
    }
  }

  async function getUserLogined() {
    try {
      const auth_ = localStorage.getItem('Authorization') as string

      const p = {
        method: 'GET',
        headers: {
          Authorization: auth_
        }
      }

      // Lấy số đơn vị chưa upload báo cáo trong khoảng thời gian from-to
      const res = await fetch(globalVariables.url_auth + '/get-current-user', p)

      if (!res.ok) {
        return
      }

      const userLogin = await res.json()

      if (userLogin !== undefined) {
        dispatch(setUserLogined(userLogin))
      }
    } catch (exception) {
      // route.replace('/pages/misc/500-server-error')
    }
  }

  if (role) {
    // Kiểm tra các path admin và post với quyền (role), nếu hợp lệ thì cho qua, nếu không hợp lệ thì chuyển đến trang login
    if (pathname.substring(4, 9) == 'admin' && !allowed_admin.includes(role)) {
      redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
    } else if (pathname.substring(4, 8) == 'user' && !allowed_user.includes(role)) {
      redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
    } else if (pathname.substring(4, 9) == 'admin' || pathname.substring(4, 8) == 'user') {
      // Đến đây các path nếu thuôc admin và post sẽ có đủ quyền (role) truy cập path tương ứng.
      // Ngoài ra sẽ có các path không thuộc admin và post, các path này ta sẽ cho vào mà không cần quyền (role)
      // Tuy nhiên với các path admin và post, khi vào page cần có token và userLogin, do đó cần chờ token và userLogin được sẽ giá trị
      // thì ta mới bắt đầu render page. Do đó, ta cần điều kiện if(auth.token != ''), khi đó cũng có nghĩa là userLogin cũng đã được đặt xong giá trị

      if (auth.token != '' && auth.token == auth_ && userLogined.username != '') {
        // alert('auth: ' + auth_ + '; auth global: ' + auth.token + '; role: ' + role)

        // Vì sao vừa auth.token != '' && auth.token == auth_, vì sẽ có lần auth.token khác rỗng nhưng là token của phiên trước
        // Điều kiện này sẽ chỉ trả về đúng phiên hiện tại
        // Và có thể trả về sẽ trước khi userLogined được đặt giá trị. Do đó cần thêm điều kiện userLogin.username != ''
        return <>{children}</>
      }
    } else {
      // Đến đây chỉ còn các path không cần role, không token và userLogin
      return <>{children}</>
    }
  }
}
