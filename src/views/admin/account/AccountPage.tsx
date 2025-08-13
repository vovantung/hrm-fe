'use client'

import type { ComponentType, SyntheticEvent } from 'react'
import { Fragment, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Alert,
  Box,
  Button,
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
import { setLastAccounts } from '@/redux-store/slices/accounts'
import { useSettings } from '@/@core/hooks/useSettings'

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
  const accountsOfPage = useSelector((state: any) => state.accounts.lastAccounts) as AccountDataType[]

  const [departments, setDepartments] = useState<DepartmentDataType[]>([])
  const [roles, setRoles] = useState<RoleDataType[]>([])

  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.customReducer)

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
    dispatch(setLastAccounts(accountsOfPage)) // Cập nhật redux với accountsOfPage mới
  }

  async function handleRemoveAccount(event: any) {
    try {
      const username = event.target.id.substring(0, event.target.id.length - 2)
      const auth = localStorage.getItem('Authorization') as string

      if (!(username == '' || username == undefined)) {
        const r = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth
          },
          body: JSON.stringify({
            username: username
          })
        }

        const response = await fetch(store.url_admin + '/account/remove', r)

        if (!response.ok) {
          const rs = await response.json()

          handleErrorOpen('Can not delete account, cause by ' + rs.errorMessage)

          return
        }

        const rs = await response.json()

        if (rs !== undefined && rs == true) {
          initData()
          handleAlertOpen('Deleted [' + username + '] account')
        }
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleViewUpdateAccount(event: any) {
    try {
      const username = event.target.id.substring(0, event.target.id.length - 2)
      const auth = localStorage.getItem('Authorization') as string

      if (!(username == '' || username == undefined)) {
        const p = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth
          },
          body: JSON.stringify({
            username: username
          })
        }

        const response = await fetch(store.url_admin + '/account/get-by-username', p)

        if (!response.ok) {
          const rs = await response.json()

          handleErrorOpen('Can not get account, cause by ' + rs.errorMessage)

          return
        }

        const accounts = await response.json()

        if (accounts !== undefined) {
          setUpdateAccount(accounts)
          toggleUpdateAccountDailog()
        }
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleUpdateAccount() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
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

      const response = await fetch(store.url_admin + '/account/create-or-update', p)

      if (!response.ok) {
        const rs = await response.json()

        handleErrorOpen('Can not add new account, cause by ' + rs.errorMessage)

        return
      }

      const acount = await response.json()

      if (acount !== undefined) {
        closeUpdateAccountDailog()
        initData()
        handleAlertOpen('Updated infor for [' + acount.username + '] account')
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function onChangeDepartmentToUpdate(e: any) {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          id: e.target.value
        })
      }

      const response = await fetch(store.url_admin + '/department/get-by-id', p)

      if (!response.ok) {
        const rs = await response.json()

        handleErrorOpen('Can not get department, cause by ' + rs.errorMessage)

        return
      }

      const department = await response.json()

      if (department !== undefined) {
        setUpdateAccount({ ...updateAccount, department: department })
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function onChangeRoleToUpdate(e: any) {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          id: e.target.value
        })
      }

      const res = await fetch(store.url_admin + '/role/get-by-id', p)

      if (!res.ok) {
        const rs = await res.json()

        handleErrorOpen('Can not get role, cause by ' + rs.errorMessage)

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

  async function handleCreateAccount() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
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

      const response = await fetch(store.url_admin + '/account/create-or-update', p)

      if (!response.ok) {
        const rs = await response.json()

        handleErrorOpen('Can not add new account, cause by ' + rs.errorMessage)

        return
      }

      const acount = await response.json()

      if (acount !== undefined) {
        closeCreateAccountDailog()
        initData()
        handleAlertOpen('Added [' + acount.username + '] account')
      }
    } catch (error) {
      console.log(error)
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function onChangeDepartmentToCreate(e: any) {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          id: e.target.value
        })
      }

      const response = await fetch(store.url_admin + '/department/get-by-id', p)

      if (!response.ok) {
        const rs = await response.json()

        handleErrorOpen('Can not get department, cause by ' + rs.errorMessage)

        return
      }

      const department = await response.json()

      if (department !== undefined) {
        setCreateAccount({ ...createAccount, department: department })
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function onChangeRoleToCreate(e: any) {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          id: e.target.value
        })
      }

      const res = await fetch(store.url_admin + '/role/get-by-id', p)

      if (!res.ok) {
        const rs = await res.json()

        handleErrorOpen('Can not get role, cause by ' + rs.errorMessage)

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

  useEffect(() => {
    initData()
  }, [])

  async function initData() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      // Load Accounts
      const p1 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          limit: 100
        })
      }

      const response = await fetch(store.url_admin + '/account/get-limit', p1)

      if (!response.ok) {
        const rs = await response.json()

        handleErrorOpen('Can not get list account, cause by ' + rs.errorMessage)

        return
      }

      const accounts = await response.json()

      if (accounts !== undefined) {
        setAccounts(accounts)
      }

      //  Load Departments
      const p2 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          limit: 100
        })
      }

      const response1 = await fetch(store.url_admin + '/department/get-limit', p2)

      if (!response.ok) {
        const rs = await response.json()

        handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)

        return
      }

      const departments = await response1.json()

      if (departments !== undefined) {
        setDepartments(departments)
      }

      // Load roles
      //  Load Departments
      const p3 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          limit: 100
        })
      }

      const res3 = await fetch(store.url_admin + '/role/get-limit', p3)

      if (!res3.ok) {
        const rs3 = await res3.json()

        handleErrorOpen('Can not get list department, cause by ' + rs3.errorMessage)

        return
      }

      const roles = await res3.json()

      if (roles !== undefined) {
        setRoles(roles)
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  if (accounts)
    return (
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
                    <b>Username</b>
                  </TableCell>
                  <TableCell>
                    <b>Full name</b>
                  </TableCell>
                  <TableCell>
                    <b>Department</b>
                  </TableCell>
                  <TableCell>
                    <b>Phone number</b>
                  </TableCell>
                  <TableCell>
                    <b>Email</b>
                  </TableCell>
                  <TableCell>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accountsOfPage.map(account => (
                  <TableRow key={account.id}>
                    <TableCell style={{ fontSize: '14.5px' }}>{account.username}</TableCell>
                    <TableCell style={{ fontSize: '14.5px' }}>{account.lastName + ' ' + account.firstName} </TableCell>
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
                            icon='fluent:person-delete-16-regular'
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
                            icon='radix-icons:update'
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
            <Button variant='contained' startIcon={<i className='wpf-add-user' />} onClick={handleViewCreateAccount}>
              Add account
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
                startIcon={<i className='material-symbols-system-update-alt' />}
                sx={{ mr: 3.5 }}
                color='primary'
                onClick={handleUpdateAccount}
              >
                Update
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
                startIcon={<i className='gridicons-create' />}
                sx={{ mr: 3.5 }}
                color='primary'
                onClick={handleCreateAccount}
              >
                Create
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
    )
}

export default AccountPage
