'use client'

// React Imports
import type { ComponentType, SyntheticEvent } from 'react'
import { Fragment, useEffect, useState } from 'react'

// import type { ChangeEvent } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Component Imports
import { useSelector } from 'react-redux'

import type { SlideProps } from '@mui/material'
import { Alert, IconButton, InputAdornment, Slide, Snackbar } from '@mui/material'

import CustomTextField from '@core/components/mui/TextField'

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

type TransitionProps = Omit<SlideProps, 'direction'>

const TransitionUp = (props: TransitionProps) => {
  return <Slide {...props} direction='down' />
}

const AccountDetails = () => {
  // States

  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  // const [fileInput, setFileInput] = useState<string>('')

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  const [file, setFile] = useState<File | null>(null)

  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  const userLogined = useSelector((state: any) => state.accounts.userLogined) as AccountDataType

  const [imgSrc, setImgSrc] = useState<string>(userLogined.avatarUrl)

  const [accountCreateUpdate, setAccountCreateUpdate] = useState<AccountDataType>(userLogined)

  // Dữ liệu, cài đặt hông báo...
  const [transition, setTransition] = useState<ComponentType<TransitionProps>>()
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [message, setMessage] = useState<string>()

  const handleAlertOpen = (message: string) => {
    setTransition(() => TransitionUp)
    setMessage(message)
    setOpenAlert(true)
  }

  const handleAlertClose = (event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenAlert(false)
  }

  // Alert error
  const [openError, setOpenError] = useState<boolean>(false)

  const handleErrorOpen = (message: string) => {
    setTransition(() => TransitionUp)
    setMessage(message)
    setOpenError(true)
  }

  const handleErrorClose = (event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenError(false)
  }

  const handleFormChange = (field: keyof AccountDataType, value: AccountDataType[keyof AccountDataType]) => {
    setAccountCreateUpdate({ ...accountCreateUpdate, [field]: value })
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    const { files } = event.target as HTMLInputElement

    if (files && files.length > 0) {
      const selectedFile = files[0]

      // Lưu file gốc vào state để gửi API
      setFile(selectedFile)

      // Preview ảnh (nếu cần hiển thị)
      reader.onload = () => {
        setImgSrc(reader.result as string)

        // setFileInput(reader.result as string) // nếu bạn còn cần base64
      }

      reader.readAsDataURL(selectedFile)
    }

    // reset input để có thể chọn lại cùng một file
    event.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (file) {
      const param1 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          filename: file.name
        })
      }

      const res1 = await fetch(globalVariables.url_user + '/account/get-presignedurl-for-put', param1)

      if (!res1.ok) {
        const resError = await res1.json()

        handleErrorOpen('Can not get department, cause by ' + resError.errorMessage)

        return
      }

      const rs1 = await res1.json()

      if (rs1 !== undefined) {
        const res2 = await fetch(rs1.pre_signed_url, { method: 'PUT', body: file })

        if (!res2.ok) {
          const resError = await res2.json()

          handleErrorOpen('Can not get department, cause by ' + resError.errorMessage)

          return
        }

        const param3 = {
          method: 'POST',
          headers: {
            Authorization: auth.token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filename: rs1.filename,
            username: accountCreateUpdate.username,
            firstName: accountCreateUpdate.firstName,
            lastName: accountCreateUpdate.lastName,
            email: accountCreateUpdate.email,
            phoneNumber: accountCreateUpdate.phoneNumber,
            password: accountCreateUpdate.newpassword
          })
        }

        const res3 = await fetch(globalVariables.url_user + '/account/update-avatar', param3)

        if (!res3.ok) {
          const resError = await res3.json()

          handleErrorOpen('Can not upload weekly report, cause by ' + resError.errorMessage)

          return
        }

        // const reportWeekly = await res3.json()

        // handleAlertOpen('Upload ' + reportWeekly.originName + ' report success.')
        handleAlertOpen('Updated success')
        window.location.reload()
      }
    } else {
      const param = {
        method: 'POST',
        headers: {
          Authorization: auth.token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: '',
          username: accountCreateUpdate.username,
          firstName: accountCreateUpdate.firstName,
          lastName: accountCreateUpdate.lastName,
          email: accountCreateUpdate.email,
          phoneNumber: accountCreateUpdate.phoneNumber,
          password: accountCreateUpdate.newpassword
        })
      }

      const res = await fetch(globalVariables.url_user + '/account/update-avatar', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not upload weekly report, cause by ' + resError.errorMessage)

        return
      }

      // const rs = await res.json()
      handleAlertOpen('Updated success')
      window.location.reload()
    }
  }

  useEffect(() => {
    // alert('username: ' + userLogined.username)
    setAccountCreateUpdate(userLogined)
  }, [])

  return (
    <Card>
      <CardContent className='mbe-4'>
        <div className='flex max-sm:flex-col items-center gap-6'>
          <img height={100} width={100} className='rounded' src={imgSrc} alt='Profile' />
          <div className='flex flex-grow flex-col gap-4'>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Button component='label' variant='contained' htmlFor='account-settings-upload-image'>
                Upload New Photo
                <input
                  hidden
                  type='file'
                  accept='image/png, image/jpeg'
                  onChange={handleFileInputChange}
                  id='account-settings-upload-image'
                />
              </Button>
            </div>
            <Typography>Allowed JPG, GIF or PNG. Max size of 800K</Typography>
          </div>
        </div>
      </CardContent>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={6}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='First Name'
                value={accountCreateUpdate.firstName}
                placeholder='John'
                onChange={e => handleFormChange('firstName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Last Name'
                value={accountCreateUpdate.lastName}
                placeholder='Doe'
                onChange={e => handleFormChange('lastName', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Email'
                value={accountCreateUpdate.email}
                placeholder='john.doe@gmail.com'
                onChange={e => handleFormChange('email', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Phone Number'
                value={accountCreateUpdate.phoneNumber}
                placeholder='+1 (234) 567-8901'
                onChange={e => handleFormChange('phoneNumber', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Password'
                placeholder='********'
                id='form-layout-basic-password'
                type={isPasswordShown ? 'text' : 'password'}
                helperText='Use 8 or more characters with a mix of letters, numbers & symbols'
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle password visibility'
                        >
                          <i className={isPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                onChange={e => handleFormChange('newpassword', e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField
                fullWidth
                label='Confirm Password'
                placeholder='********'
                id='form-layout-basic-confirm-password'
                type={isConfirmPasswordShown ? 'text' : 'password'}
                helperText='Make sure to type the same password as above'
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={e => e.preventDefault()}
                          aria-label='toggle confirm password visibility'
                        >
                          <i className={isConfirmPasswordShown ? 'tabler-eye-off' : 'tabler-eye'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField disabled fullWidth label='Role' value={accountCreateUpdate.role.name} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <CustomTextField disabled fullWidth label='Department' value={accountCreateUpdate.department.name} />
            </Grid>

            <Grid size={{ xs: 12 }} className='flex gap-4 flex-wrap'>
              <Button variant='contained' type='submit'>
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      {/* Alert */}
      <Fragment>
        <Snackbar
          open={openAlert}
          onClose={handleAlertClose}
          autoHideDuration={2500}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          TransitionComponent={transition}
        >
          <Alert
            variant='filled'
            severity='info'
            style={{ color: 'white', backgroundColor: '#056abdff' }}
            onClose={handleAlertClose}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Fragment>
      {/* Error */}
      <Fragment>
        <Snackbar
          open={openError}
          onClose={handleErrorClose}
          autoHideDuration={2500}
          anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
          TransitionComponent={transition}
        >
          <Alert
            variant='filled'
            severity='error'
            style={{ color: 'white', backgroundColor: '#c51111a9' }}
            onClose={handleErrorClose}
            sx={{ width: '100%' }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Fragment>
    </Card>
  )
}

export default AccountDetails
