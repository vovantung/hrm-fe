'use client'

import type { ComponentType, SyntheticEvent } from 'react'
import { Fragment, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  MenuItem,
  Slide,
  Snackbar,
  styled,
  Typography
} from '@mui/material'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import type { IconButtonProps, SlideProps } from '@mui/material'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDispatch, useSelector } from 'react-redux'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import Pagination from '../PaginationTXU'

import { useSettings } from '@/@core/hooks/useSettings'
import { setAccountsOfPage } from '@/redux-store/slices/accounts'

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: '#a30a12ff',
  position: 'absolute',
  boxShadow: theme.shadows[3],
  transform: 'translate(-2px, 2px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(-3px, 3px)',
    color: '#e6252fff'
  }
}))

type AccountDataType = {
  id: number
  username: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  department: DepartmentDataType
  role: RoleDataType
  newpassword: string
}

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
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

const AccountPage = () => {
  const route = useRouter()
  const { settings } = useSettings()

  // Data Accounts, Departments  Page
  const [accounts, setAccounts] = useState<AccountDataType[]>([])

  // const [accountsOfPage, setAccountsOfPage] = useState<AccountDataType[]>([])
  // Sử dụng redux lưu dữ liệu chia sẽ giữa các thành phần trong ứng dụng
  const accountsOfPage = useSelector((state: any) => state.accounts.accountsOfPage) as AccountDataType[]

  const [departments, setDepartments] = useState<DepartmentDataType[]>([])
  const [roles, setRoles] = useState<RoleDataType[]>([])

  const dispatch = useDispatch()
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  // const auth = localStorage.getItem('Authorization') as string

  // Data temp using for update account
  const [updateAccount, setUpdateAccount] = useState<AccountDataType>({
    id: 0,
    username: '',
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    department: {
      id: 0,
      name: '',
      description: '',
      createdAt: '',
      updateAt: ''
    },
    role: {
      id: 0,
      name: '',
      createdAt: '',
      updateAt: ''
    },
    newpassword: ''
  })

  // Data temp using for create account
  const [createAccount, setCreateAccount] = useState<AccountDataType>({
    id: 0,
    username: '',
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    department: {
      id: 0,
      name: '',
      description: '',
      createdAt: '',
      updateAt: ''
    },
    role: {
      id: 0,
      name: '',
      createdAt: '',
      updateAt: ''
    },
    newpassword: ''
  })

  // Dailog update account
  const [updateAccountDailog, setUpdateAccountDailog] = useState<boolean>(false)
  const toggleUpdateAccountDailog = () => setUpdateAccountDailog(!updateAccountDailog)

  const closeUpdateAccountDailog = () => {
    toggleUpdateAccountDailog()
  }

  // Dailog add new account
  const [createAccountDailog, setCreateAccountDailog] = useState<boolean>(false)
  const toggleCreateAccountDailog = () => setCreateAccountDailog(!createAccountDailog)

  const closeCreateAccountDailog = () => {
    toggleCreateAccountDailog()
  }

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

  // Dữ liệu, cài đặt button ẩn hiện cho textfied password
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)

  function onChangePage(accountsOfPage: any) {
    // setAccountsOfPage(accountsOfPage)
    dispatch(setAccountsOfPage(accountsOfPage)) // Cập nhật redux với accountsOfPage mới
  }

  useEffect(() => {
    // Nạp danh sách accounts, roles, department lần đâu khi load trang
    initAccounts()
    initRolesDepartments()
  }, [])

  async function initAccounts() {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      // Load Accounts
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          limit: 1000
        })
      }

      const res = await fetch(globalVariables.url_admin + '/account/get-limit', param)

      if (!res.ok) {
        const rs = await res.json()

        handleErrorOpen('Can not get list account, cause by ' + rs.errorMessage)

        return
      }

      const accounts = await res.json()

      if (accounts !== undefined) {
        setAccounts(accounts)
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function initRolesDepartments() {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      //  Load Departments
      const param1 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          limit: 1000
        })
      }

      const res1 = await fetch(globalVariables.url_admin + '/department/get-limit', param1)

      if (!res1.ok) {
        const rs = await res1.json()

        handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)

        return
      }

      const departments = await res1.json()

      if (departments !== undefined) {
        setDepartments(departments)
      }

      // Load roles
      const param2 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          limit: 100
        })
      }

      const res2 = await fetch(globalVariables.url_admin + '/role/get-limit', param2)

      if (!res2.ok) {
        const rs3 = await res2.json()

        handleErrorOpen('Can not get list department, cause by ' + rs3.errorMessage)

        return
      }

      const roles = await res2.json()

      if (roles !== undefined) {
        setRoles(roles)
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  // Remove account
  async function handleRemoveAccount(event: any) {
    try {
      const username = event.target.id.substring(0, event.target.id.length - 2)

      // const auth = localStorage.getItem('Authorization') as string

      if (!(username == '' || username == undefined)) {
        const param = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth.token
          },
          body: JSON.stringify({
            username: username
          })
        }

        const res = await fetch(globalVariables.url_admin + '/account/remove', param)

        if (!res.ok) {
          const resError = await res.json()

          handleErrorOpen('Can not delete account, cause by ' + resError.errorMessage)

          return
        }

        const result = await res.json()

        if (result !== undefined && result == true) {
          // Nạp lại danh sách accounts sau khi đã xóa một account
          initAccounts()
          handleAlertOpen('Deleted [' + username + '] account')
        }
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  // Update account
  async function handleViewUpdateAccount(event: any) {
    try {
      const username = event.target.id.substring(0, event.target.id.length - 2)

      // const auth = localStorage.getItem('Authorization') as string

      if (!(username == '' || username == undefined)) {
        const param = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth.token
          },
          body: JSON.stringify({
            username: username
          })
        }

        const res = await fetch(globalVariables.url_admin + '/account/get-by-username', param)

        if (!res.ok) {
          const resError = await res.json()

          handleErrorOpen('Can not get account, cause by ' + resError.errorMessage)

          return
        }

        const accounts = await res.json()

        if (accounts !== undefined) {
          setUpdateAccount(accounts)
          toggleUpdateAccountDailog()
        }
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function onChangeDepartmentToUpdate(e: any) {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          id: e.target.value
        })
      }

      const res = await fetch(globalVariables.url_admin + '/department/get-by-id', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get department, cause by ' + resError.errorMessage)

        return
      }

      const department = await res.json()

      if (department !== undefined) {
        // Đặt lại department mới được chọn cho trạng thái update, updateAccount chứa dữ liệu để update và hiện thị trên giao diện (dialog) update
        setUpdateAccount({ ...updateAccount, department: department })
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function onChangeRoleToUpdate(e: any) {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          id: e.target.value
        })
      }

      const res = await fetch(globalVariables.url_admin + '/role/get-by-id', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get role, cause by ' + resError.errorMessage)

        return
      }

      const role = await res.json()

      if (role !== undefined) {
        setUpdateAccount({ ...updateAccount, role: role })
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleUpdateAccount() {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          id: updateAccount.id,
          lastName: updateAccount.lastName,
          firstName: updateAccount.firstName,
          phoneNumber: updateAccount.phoneNumber,
          department: updateAccount.department,
          role: updateAccount.role,
          email: updateAccount.email,
          password: updateAccount.newpassword
        })
      }

      const res = await fetch(globalVariables.url_admin + '/account/create-or-update', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not add new account, cause by ' + resError.errorMessage)

        return
      }

      const acount = await res.json()

      if (acount !== undefined) {
        closeUpdateAccountDailog()

        // Nạp lại danh sách accounts sau khi đã cập nhật account
        initAccounts()
        handleAlertOpen('Updated infor for [' + acount.username + '] account')
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  // Create account
  function handleViewCreateAccount() {
    setCreateAccount({
      id: 0,
      username: 'txu',
      lastName: '',
      firstName: '',
      email: 'txu@gmail.com',
      phoneNumber: '',
      department: {
        // id: departments[0].id,
        id: 0,
        name: '',
        description: '',
        createdAt: '',
        updateAt: ''
      },
      role: {
        id: 0,
        name: '',
        createdAt: '',
        updateAt: ''
      },
      newpassword: 'txu'
    })

    toggleCreateAccountDailog()
  }

  async function onChangeDepartmentToCreate(e: any) {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          id: e.target.value
        })
      }

      const res = await fetch(globalVariables.url_admin + '/department/get-by-id', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get department, cause by ' + resError.errorMessage)

        return
      }

      const department = await res.json()

      if (department !== undefined) {
        setCreateAccount({ ...createAccount, department: department })
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function onChangeRoleToCreate(e: any) {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          id: e.target.value
        })
      }

      const res = await fetch(globalVariables.url_admin + '/role/get-by-id', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get role, cause by ' + resError.errorMessage)

        return
      }

      const role = await res.json()

      if (role !== undefined) {
        setCreateAccount({ ...createAccount, role: role })
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleCreateAccount() {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          username: createAccount.username,
          lastName: createAccount.lastName,
          firstName: createAccount.firstName,
          phoneNumber: createAccount.phoneNumber,
          department: createAccount.department,
          role: createAccount.role,
          email: createAccount.email,
          password: createAccount.newpassword
        })
      }

      const res = await fetch(globalVariables.url_admin + '/account/create-or-update', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not add new account, cause by ' + resError.errorMessage)

        return
      }

      const acount = await res.json()

      if (acount !== undefined) {
        closeCreateAccountDailog()

        // Nạp lại danh sách accounts sau khi đã tạo mới account
        initAccounts()
        handleAlertOpen('Added [' + acount.username + '] account')
      }
    } catch (error) {
      console.log(error)
      route.replace('/pages/misc/500-server-error')
    }
  }

  if (accounts)
    return (
      <div style={{ position: 'relative', minHeight: '100%' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.281)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            opacity: accountsOfPage.length === 0 ? 1 : 0,
            pointerEvents: accountsOfPage.length === 0 ? 'auto' : 'none',
            transition: 'opacity 0.8s ease'
          }}
        >
          <CircularProgress sx={{ color: '#175ea1' }} size={36} thickness={4} />
        </div>

        <div style={{ opacity: accountsOfPage.length ? 1 : 0, transition: 'opacity 0.2s ease' }}>
          <Card>
            <CardHeader title='ACCOUNT' />
            <CardContent className='p-0'>
              <TableContainer
                style={{ maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 355px)' : 'calc(100vh - 310px)' }}
              >
                <Table className={tableStyles.table} stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Họ tên</b>
                      </TableCell>
                      <TableCell>
                        <b>Tên người dùng</b>
                      </TableCell>
                      <TableCell>
                        <b>Đơn vị</b>
                      </TableCell>
                      <TableCell>
                        <b>Số điện thoại</b>
                      </TableCell>
                      <TableCell>
                        <b>Email</b>
                      </TableCell>
                      <TableCell>
                        <b>Hành động</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {accountsOfPage.map(account => (
                      <TableRow key={account.id}>
                        <TableCell style={{ fontSize: '14.5px' }}>
                          {account.lastName + ' ' + account.firstName}{' '}
                        </TableCell>
                        <TableCell style={{ fontSize: '14.5px' }}>{account.username}</TableCell>
                        <TableCell style={{ fontSize: '14.5px' }}>{account.department?.name ?? ''}</TableCell>
                        <TableCell style={{ fontSize: '14.5px' }}>{account.phoneNumber}</TableCell>
                        <TableCell style={{ fontSize: '14.5px' }}>{account.email}</TableCell>
                        <TableCell>
                          <IconButton
                            color='primary'
                            size='small'
                            sx={{ paddingBottom: 0, paddingTop: 0, marginRight: '5px' }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Icon
                                icon='mingcute:delete-line'
                                id={account.username + '_0'}
                                onClick={handleRemoveAccount}
                                style={{ width: '100%', height: '100%' }}
                              />
                            </Box>
                          </IconButton>
                          |
                          <IconButton
                            color='primary'
                            size='small'
                            sx={{ paddingBottom: 0, paddingTop: 0, marginLeft: '5px' }}
                          >
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Icon
                                id={account.username + '_1'}
                                icon='nimbus-edit'
                                onClick={handleViewUpdateAccount}
                                style={{ width: '100%', height: '100%' }}
                              />
                            </Box>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginLeft: '25px',
                  marginTop: '20px',
                  marginBottom: '20px',
                  marginRight: '20px'
                }}
              >
                <Button
                  variant='contained'
                  startIcon={<i className='wpf-add-user' />}
                  onClick={handleViewCreateAccount}
                >
                  Thêm tài khoản
                </Button>
                <Pagination pageSize={8} items={accounts} onChangePage={onChangePage} />
              </Box>
            </CardContent>

            {/* Hộp thoại update account  */}
            <Dialog
              fullWidth
              open={updateAccountDailog}
              onClose={toggleUpdateAccountDailog}
              sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
              <DialogContent>
                <CustomCloseButton onClick={closeUpdateAccountDailog}>
                  <Icon icon='pajamas:close-xs' fontSize='1.25rem' />
                </CustomCloseButton>
                <Typography variant='h4' sx={{ marginBottom: '5px' }}>
                  Account
                </Typography>

                <Box sx={{ overflow: 'auto' }}>
                  <CustomTextField
                    autoFocus
                    fullWidth
                    label='Last name'
                    placeholder='Enter last name'
                    value={updateAccount.lastName ?? ''}
                    onChange={e => setUpdateAccount({ ...updateAccount, lastName: e.target.value })}
                  />
                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    autoFocus
                    fullWidth
                    label='First name'
                    placeholder='Enter first name'
                    value={updateAccount.firstName ?? ''}
                    onChange={e => setUpdateAccount({ ...updateAccount, firstName: e.target.value })}
                  />

                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    autoFocus
                    fullWidth
                    label='Phone number'
                    placeholder='Enter phone number'
                    value={updateAccount.phoneNumber ?? ''}
                    onChange={e => setUpdateAccount({ ...updateAccount, phoneNumber: e.target.value })}
                  />
                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    autoFocus
                    fullWidth
                    type='email'
                    helperText='You can use letters, numbers & periods'
                    label='Email'
                    placeholder='Enter email'
                    value={updateAccount.email ?? ''}
                    onChange={e => setUpdateAccount({ ...updateAccount, email: e.target.value })}
                  />
                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    select
                    fullWidth
                    label='Department'
                    onChange={onChangeDepartmentToUpdate}
                    value={updateAccount.department.id}
                  >
                    {departments.map(department => (
                      <MenuItem key={department.id} value={department.id}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>

                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    select
                    fullWidth
                    label='Role'
                    onChange={onChangeRoleToUpdate}
                    value={updateAccount.role.id}
                  >
                    {roles.map(role => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>

                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    fullWidth
                    label='New password (leave blank if no update needed)'
                    placeholder='Enter new password'
                    id='form-layout-basic-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    helperText='Use 8 or more characters with a mix of letters, numbers & symbols'
                    value={updateAccount.newpassword ?? ''}
                    onChange={e => setUpdateAccount({ ...updateAccount, newpassword: e.target.value })}
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
                  />
                </Box>
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <Button
                    variant='contained'
                    startIcon={<i className='ic-round-save-alt' />}
                    sx={{ mr: 3.5 }}
                    color='primary'
                    onClick={handleUpdateAccount}
                  >
                    Cập nhật
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Hộp thoại thêm mới account */}

            <Dialog
              fullWidth
              open={createAccountDailog}
              onClose={toggleCreateAccountDailog}
              sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            >
              <DialogContent>
                <CustomCloseButton onClick={closeCreateAccountDailog}>
                  <Icon icon='pajamas:close-xs' fontSize='1.25rem' />
                </CustomCloseButton>
                <Typography variant='h4' sx={{ marginBottom: '5px' }}>
                  Account
                </Typography>

                <Box sx={{ overflow: 'auto' }}>
                  <CustomTextField
                    autoFocus
                    fullWidth
                    label='Username'
                    placeholder='Enter username'
                    value={createAccount.username ?? ''}
                    onChange={e => setCreateAccount({ ...createAccount, username: e.target.value })}
                    error={createAccount.username === ''}
                    helperText={createAccount.username === '' ? 'This field is required.' : ''}
                  />

                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    fullWidth
                    label='Password'
                    placeholder='Enter new password'
                    id='form-layout-basic-password'
                    type={isPasswordShown ? 'text' : 'password'}
                    error={createAccount.newpassword === ''}
                    helperText={
                      createAccount.newpassword === ''
                        ? 'This field is required.Use 8 or more characters with a mix of letters, numbers & symbols'
                        : ''
                    }
                    value={createAccount.newpassword ?? ''}
                    onChange={e => setCreateAccount({ ...createAccount, newpassword: e.target.value })}
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
                  />
                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    autoFocus
                    fullWidth
                    label='Last name'
                    placeholder='Enter last name'
                    value={createAccount.lastName ?? ''}
                    onChange={e => setCreateAccount({ ...createAccount, lastName: e.target.value })}
                  />
                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    autoFocus
                    fullWidth
                    label='First name'
                    placeholder='Enter first name'
                    value={createAccount.firstName ?? ''}
                    onChange={e => setCreateAccount({ ...createAccount, firstName: e.target.value })}
                  />

                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    autoFocus
                    fullWidth
                    label='Phone number'
                    placeholder='Enter phone number'
                    value={createAccount.phoneNumber ?? ''}
                    onChange={e => setCreateAccount({ ...createAccount, phoneNumber: e.target.value })}
                  />
                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    autoFocus
                    fullWidth
                    type='email'
                    label='Email'
                    placeholder='Enter email'
                    error={createAccount.email === ''}
                    helperText={
                      createAccount.email === '' ? 'This field is required. You can use letters, numbers & periods' : ''
                    }
                    value={createAccount.email ?? ''}
                    onChange={e => setCreateAccount({ ...createAccount, email: e.target.value })}
                  />
                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    select
                    fullWidth
                    label='Department'
                    onChange={onChangeDepartmentToCreate}
                    value={createAccount.department.id}
                  >
                    {departments.map(department => (
                      <MenuItem key={department.id} value={department.id}>
                        {department.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                  <CustomTextField
                    style={{ marginTop: '15px' }}
                    select
                    fullWidth
                    label='Role'
                    onChange={onChangeRoleToCreate}
                    value={createAccount.role.id}
                  >
                    {roles.map(role => (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Box>
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <Button
                    variant='contained'
                    startIcon={<i className='material-symbols-person-add-rounded' />}
                    sx={{ mr: 3.5 }}
                    color='primary'
                    onClick={handleCreateAccount}
                  >
                    Thêm
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

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
        </div>
      </div>
    )
}

export default AccountPage
