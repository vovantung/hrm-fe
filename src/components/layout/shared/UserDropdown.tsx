'use client'

// React Imports
import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'

// Third-party Imports
// import { signOut, useSession } from 'next-auth/react'
// import { useSession } from 'next-auth/react'

// Type Imports
import { useDispatch, useSelector } from 'react-redux'

import type { Locale } from '@configs/i18n'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import { setUserLogin } from '@/redux-store/slices/accounts'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

type AccountDataType = {
  id: number
  username: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  avatar: string
  department: DepartmentDataType
  newpassword: string
}

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  // const { data: session } = useSession()
  const { settings } = useSettings()
  const { lang: locale } = useParams()

  const store = useSelector((state: any) => state.customReducer)
  const userLogin = useSelector((state: any) => state.accounts.userLogin) as AccountDataType

  const dispatch = useDispatch()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale as Locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  // const handleUserLogout = async () => {
  //   try {
  //     // Sign out from the app
  //     await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
  //   } catch (error) {
  //     console.error(error)

  //     // Show above error in a toast like following
  //     // toastService.error((err as Error).message)
  //   }
  // }

  const handleUserLogoutTXU = async () => {
    try {
      // Sign out from the app
      localStorage.clear()
      window.location.reload()
    } catch (error) {
      console.error(error)

      // Show above error in a toast like following
      // toastService.error((err as Error).message)
    }
  }

  async function getNotReportedFromTo() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'GET',
        headers: {
          Authorization: auth
        }
      }

      // Lấy số đơn vị chưa upload báo cáo trong khoảng thời gian from-to
      const res = await fetch(store.url_admin + '/account/get-current-user', p)

      if (!res.ok) {
        return
      }

      const userLogin = await res.json()

      if (userLogin !== undefined) {
        dispatch(setUserLogin(userLogin))
      }
    } catch (exception) {
      // route.replace('/pages/misc/500-server-error')
    }
  }

  useEffect(() => {
    getNotReportedFromTo()
  }, [])

  return (
    <>
      <Badge
        ref={anchorRef}
        overlap='circular'
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        className='mis-2'
      >
        <Avatar
          ref={anchorRef}
          onClick={handleDropdownOpen}
          className='cursor-pointer bs-[38px] is-[38px]'
          alt={userLogin.lastName + userLogin.firstName || ''}
          src={userLogin.avatar || ''}
        />
      </Badge>
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-3 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-6 gap-2' tabIndex={-1}>
                    {/* <Avatar alt={session?.user?.name || ''} src={session?.user?.image || ''} /> */}
                    <Avatar alt={userLogin.lastName + userLogin.firstName || ''} src={userLogin.avatar || ''} />

                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {/* {session?.user?.name || ''} */}
                        {userLogin.lastName + ' ' + userLogin.firstName || ''}
                      </Typography>
                      {/* <Typography variant='caption'>{session?.user?.email || ''}</Typography> */}
                      <Typography variant='caption'>{userLogin.email || ''}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/user-profile')}>
                    <i className='tabler-user' />
                    <Typography color='text.primary'>My Profile</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/account-settings')}>
                    <i className='tabler-settings' />
                    <Typography color='text.primary'>Settings</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/pricing')}>
                    <i className='tabler-currency-dollar' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='mli-2 gap-3' onClick={e => handleDropdownClose(e, '/pages/faq')}>
                    <i className='tabler-help-circle' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem>
                  <div className='flex items-center plb-2 pli-3'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='tabler-logout' />}
                      onClick={handleUserLogoutTXU}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
