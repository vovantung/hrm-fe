'use client'

import type { ComponentType, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'

import { Alert, Box, CircularProgress, Portal, Slide, Snackbar } from '@mui/material'

import Card from '@mui/material/Card'

// import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import type { SlideProps } from '@mui/material'

// import { Icon } from '@iconify/react/dist/iconify.js'
import { useDispatch, useSelector } from 'react-redux'

import tableStyles from '@core/styles/table.module.css'

// import CustomTextField from '@/@core/components/mui/TextField'
import Pagination from '../PaginationTXU'

import { useSettings } from '@/@core/hooks/useSettings'
import { setSagasOfPage } from '@/redux-store/slices/sagas'

// const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
//   top: 0,
//   right: 0,
//   color: '#a30a12ff',
//   position: 'absolute',
//   boxShadow: theme.shadows[3],
//   transform: 'translate(-2px, 2px)',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: `${theme.palette.background.paper} !important`,
//   transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
//   '&:hover': {
//     transform: 'translate(-3px, 3px)',
//     color: '#e6252fff'
//   }
// }))

type SagaDataType = {
  id: number
  status: string
  currentStep: string
  history: string
  createdAt: string
  updateAt: string
  completedAt: string
}

type TransitionProps = Omit<SlideProps, 'direction'>

const TransitionUp = (props: TransitionProps) => {
  return <Slide {...props} direction='down' />
}

const SagaPage = () => {
  const { settings } = useSettings()

  const [container, setContainer] = useState<Element | null>(null)

  // Data Accounts, Departments  Page
  const [sagas, setSagas] = useState<SagaDataType[]>([])

  // const [accountsOfPage, setAccountsOfPage] = useState<AccountDataType[]>([])
  // Sử dụng redux lưu dữ liệu chia sẽ giữa các thành phần trong ứng dụng
  const sagasOfPage = useSelector((state: any) => state.sagas.sagasOfPage) as SagaDataType[]

  const dispatch = useDispatch()
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  // const auth = localStorage.getItem('Authorization') as string

  // Data temp using for update account

  // Dailog update account
  // const [updateAccountDailog, setUpdateAccountDailog] = useState<boolean>(false)
  // const toggleUpdateAccountDailog = () => setUpdateAccountDailog(!updateAccountDailog)

  // const closeUpdateAccountDailog = () => {
  //   toggleUpdateAccountDailog()
  // }

  // Dailog add new account
  // const [createAccountDailog, setCreateAccountDailog] = useState<boolean>(false)
  // const toggleCreateAccountDailog = () => setCreateAccountDailog(!createAccountDailog)

  // const closeCreateAccountDailog = () => {
  //   toggleCreateAccountDailog()
  // }

  // Dữ liệu, cài đặt hông báo...
  const [transition, setTransition] = useState<ComponentType<TransitionProps>>()
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [message, setMessage] = useState<string>()

  // const handleAlertOpen = (message: string) => {
  //   setTransition(() => TransitionUp)
  //   setMessage(message)
  //   setOpenAlert(true)
  // }

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

  function onChangePage(sagasOfPage: any) {
    // setAccountsOfPage(accountsOfPage)
    dispatch(setSagasOfPage(sagasOfPage)) // Cập nhật redux với accountsOfPage mới
  }

  useEffect(() => {
    // Load portal
    setContainer(document.getElementById('toast-root'))

    // Nạp danh sách accounts, roles, department lần đâu khi load trang

    initSagas()
  }, [])

  async function initSagas() {
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

      const res = await fetch(globalVariables.url_saga + '/get-limit', param)

      if (!res.ok) {
        const rs = await res.json()

        handleErrorOpen('Can not get list account, cause by ' + rs.errorMessage)

        return
      }

      const sagas = await res.json()

      if (sagas !== undefined) {
        setSagas(sagas)
      }
    } catch (exception) {
      refresh()
    }
  }

  async function refresh() {
    try {
      const r = {
        method: 'POST',
        headers: {
          Authorization: auth.token,
          'Content-Type': 'application/json'
        }
      }

      const res = await fetch(globalVariables.url_auth + '/user-info', r)

      const data = await res.json()

      if (data !== undefined) {
        data?.realm_access?.roles
      }
    } catch (exception) {
      window.location.reload()
    }
  }

  if (sagas)
    return (
      <div style={{ position: 'relative', minHeight: '100%' }}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'hsla(0, 0%, 100%, 0)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            opacity: sagasOfPage.length === 0 ? 1 : 0,
            pointerEvents: sagasOfPage.length === 0 ? 'auto' : 'none',
            transition: 'opacity 0.4s ease'
          }}
        >
          <CircularProgress sx={{ color: '#175ea1' }} size={36} thickness={4} />
        </div>

        <div style={{ opacity: sagasOfPage.length ? 1 : 0, transition: 'opacity 0.2s ease' }}>
          <Card style={{ borderRadius: 3 }}>
            <h3 style={{ marginLeft: '24px', marginRight: '24px', marginBottom: '20px', marginTop: '20px' }}>SAGA</h3>
            {/* <CardHeader title='ACCOUNT' /> */}
            <CardContent className='p-0'>
              <TableContainer
                style={{ maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 340px)' : 'calc(100vh - 300px)' }}
              >
                <Table style={{ fontSize: '14px' }} className={tableStyles.table} stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ alignContent: 'center', textAlign: 'center' }}>
                        <b>Saga ID</b>
                      </TableCell>
                      <TableCell>
                        <b>Current Step</b>
                      </TableCell>
                      <TableCell>
                        <b>Stattus</b>
                      </TableCell>
                      <TableCell>
                        <b>History</b>
                      </TableCell>
                      <TableCell>
                        <b>Create At</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sagasOfPage.map(saga => (
                      <TableRow key={saga.id}>
                        <TableCell style={{ alignContent: 'center', textAlign: 'center', fontSize: '14px' }}>
                          {saga.id}
                        </TableCell>
                        <TableCell style={{ fontSize: '14px' }}>{saga.currentStep}</TableCell>
                        <TableCell style={{ fontSize: '14px' }}>{saga.status}</TableCell>
                        <TableCell style={{ fontSize: '14px', whiteSpace: 'pre-line' }}> {saga.history}</TableCell>
                        <TableCell style={{ fontSize: '14px' }}>{saga.createdAt}</TableCell>
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
                {/* <Button
                  style={{ fontSize: '14px', borderRadius: 4 }}
                  variant='contained'
                  startIcon={<i className='wpf-add-user' />}
                  onClick={handleViewCreateAccount}
                >
                  Thêm tài khoản
                </Button> */}
                <Pagination pageSize={6} items={sagas} onChangePage={onChangePage} />
              </Box>
            </CardContent>
          </Card>
        </div>

        {container && (
          <Portal container={container}>
            {/* Alert */}
            <Snackbar
              open={openAlert}
              onClose={handleAlertClose}
              autoHideDuration={2500}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
              TransitionComponent={transition}
              sx={{ zIndex: 9999 }}
            >
              <Alert
                variant='filled'
                severity='info'
                style={{ color: 'white', backgroundColor: '#056abdff' }}
                onClose={handleAlertClose}
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.548)' // 👈 shadow
                }}
              >
                {message}
              </Alert>
            </Snackbar>

            {/* Error */}
            <Snackbar
              open={openError}
              onClose={handleErrorClose}
              autoHideDuration={2500}
              anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
              TransitionComponent={transition}
              sx={{ zIndex: 9999 }}
            >
              <Alert
                variant='filled'
                severity='error'
                style={{ color: 'white', backgroundColor: '#c51111a9' }}
                onClose={handleErrorClose}
                sx={{
                  width: '100%',
                  maxWidth: '600px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.548)' // 👈 shadow
                  // borderRadius: 2 // bo góc mềm hơn (optional)
                }}
              >
                {message}
              </Alert>
            </Snackbar>
          </Portal>
        )}
      </div>
    )
}

export default SagaPage
