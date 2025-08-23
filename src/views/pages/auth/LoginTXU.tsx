'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

// MUI Imports

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'

// Type Imports
import { useSelector } from 'react-redux'

import type { Locale } from '@configs/i18n'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import CustomTextField from '@core/components/mui/TextField'

// Config Imports
// import themeConfig from '@configs/themeConfig'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Styled Component Imports
import AuthIllustrationWrapper from './AuthIllustrationWrapper'

// Vo Van Tung 17/7/2025
type LoginDataType = {
  username: string
  password: string
}

const LoginTXU = () => {
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)

  // Hooks
  const { lang: locale } = useParams()

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  // Hooks
  const router = useRouter()
  const searchParams = useSearchParams()

  // Author: Vo Van Tung
  // 17/7/2025
  const [formData, setFormData] = useState<LoginDataType>({
    username: '',
    password: ''
  })

  const handleSave = async () => {
    try {
      const r = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      }

      const response = await fetch(globalVariables.url_auth + '/authenticate', r)

      const result = await response.json()

      if (result !== undefined) {
        localStorage.setItem('Authorization', 'Bearer ' + result.jwtToken)
        const redirectURL = searchParams.get('redirectTo') ?? '/'

        router.replace(getLocalizedUrl(redirectURL, locale as Locale))
      }
    } catch (exception) {
      router.replace('/pages/misc/500-server-error')
    }
  }

  // useEffect(() => {
  //   localStorage.clear()
  // }, [])

  return (
    <AuthIllustrationWrapper>
      <Card className='flex flex-col sm:is-[450px]'>
        <CardContent className='sm:!p-12'>
          <div className='flex flex-col gap-1 mbe-6'>
            {/* <Typography variant='h4'>{`Welcome to ${themeConfig.templateName}`}</Typography> */}
            <Link href={getLocalizedUrl('/', locale as Locale)} className='flex justify-center mbe-6'>
              <Typography variant='h4' style={{ marginRight: '5px' }}>
                <span>Welcome to </span>
              </Typography>
              <Logo />
            </Link>
            <Typography>Please sign-in to your account and start the adventure</Typography>
          </div>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()} className='flex flex-col gap-6'>
            <CustomTextField
              autoFocus
              fullWidth
              label='Email or Username'
              placeholder='Enter your email or username'
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
            />
            <CustomTextField
              fullWidth
              label='Password'
              placeholder='*********'
              id='outlined-adornment-password'
              type={isPasswordShown ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton edge='end' onClick={handleClickShowPassword} onMouseDown={e => e.preventDefault()}>
                        <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />
            <div className='flex justify-between items-center gap-x-3 gap-y-1 flex-wrap'>
              <FormControlLabel control={<Checkbox />} label='Remember me' />
              <Typography
                className='text-end'
                color='primary.main'
                component={Link}
                href={getLocalizedUrl('/pages/auth/forgot-password-v1', locale as Locale)}
              >
                Forgot password?
              </Typography>
            </div>
            <Button fullWidth variant='contained' onClick={handleSave}>
              {/* <Button fullWidth variant='contained' type='submit'></Button> */}
              Login
            </Button>
            <div className='flex justify-center items-center flex-wrap gap-2'>
              <Typography>New on our platform?</Typography>
              <Typography
                component={Link}
                href={getLocalizedUrl('/pages/auth/register-v1', locale as Locale)}
                color='primary.main'
              >
                Create an account
              </Typography>
            </div>
            <Divider className='gap-2 text-textPrimary'>or</Divider>
            <div className='flex justify-center items-center gap-1.5'>
              <IconButton className='text-facebook' size='small'>
                <i className='tabler-brand-facebook-filled' />
              </IconButton>
              <IconButton className='text-twitter' size='small'>
                <i className='tabler-brand-twitter-filled' />
              </IconButton>
              <IconButton className='text-textPrimary' size='small'>
                <i className='tabler-brand-github-filled' />
              </IconButton>
              <IconButton className='text-error' size='small'>
                <i className='tabler-brand-google-filled' />
              </IconButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthIllustrationWrapper>
  )
}

export default LoginTXU
