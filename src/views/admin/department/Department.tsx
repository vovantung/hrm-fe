'use client'

import type { ComponentType, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Portal,
  Slide,
  Snackbar,
  styled,
  Typography
} from '@mui/material'

import Card from '@mui/material/Card'

// import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import type { IconButtonProps, SlideProps } from '@mui/material'
import { Icon } from '@iconify/react/dist/iconify.js'

import { format } from 'date-fns'

import { useDispatch, useSelector } from 'react-redux'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import Pagination from '../PaginationTXU'
import { useSettings } from '@/@core/hooks/useSettings'
import { setDepartmentsOfPage } from '@/redux-store/slices/departments'

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

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

type TransitionProps = Omit<SlideProps, 'direction'>

const TransitionUp = (props: TransitionProps) => {
  return <Slide {...props} direction='down' />
}

const DepartmentView = () => {
  const route = useRouter()
  const { settings } = useSettings()
  const dispatch = useDispatch()
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)
  const [container, setContainer] = useState<Element | null>(null)

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  // const auth = localStorage.getItem('Authorization') as string

  const [departments, setDepartments] = useState<DepartmentDataType[]>([])
  const departmentsOfPage = useSelector((state: any) => state.departments.departmentsOfPage) as DepartmentDataType[]

  // const [departmentsOfPage, setDepartmentsOfPage] = useState<DepartmentDataType[]>([])

  // Data temp using for update account
  const [updateDepartment, setUpdateDepartment] = useState<DepartmentDataType>({
    id: 0,
    name: '',
    description: '',
    createdAt: '',
    updatedAt: ''
  })

  // Data temp using for create account
  const [createDepartment, setCreateDepartment] = useState<DepartmentDataType>({
    id: 0,
    name: '',
    description: '',
    createdAt: '',
    updatedAt: ''
  })

  // Dailog update account
  const [updateDepartmentDailog, setUpdateDepartmentDailog] = useState<boolean>(false)
  const toggleUpdateDepartmentDailog = () => setUpdateDepartmentDailog(!updateDepartmentDailog)

  const closeUpdateDepartmentDailog = () => {
    toggleUpdateDepartmentDailog()
  }

  // Dailog add new account
  const [createDepartmentDailog, setCreateDepartmentDailog] = useState<boolean>(false)
  const toggleCreateDepartmentDailog = () => setCreateDepartmentDailog(!createDepartmentDailog)

  const closeCreateDepartmentDailog = () => {
    toggleCreateDepartmentDailog()
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

  function onChangePage(departmentsOfPage_: any) {
    dispatch(setDepartmentsOfPage(departmentsOfPage_)) // Cập nhật redux với accountsOfPage mới
    // alert(departmentsOfPage.length)
  }

  useEffect(() => {
    // Load portal
    setContainer(document.getElementById('toast-root'))
    initData()
  }, [])

  async function initData() {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      //  Load Departments
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

      const res = await fetch(globalVariables.url_admin + '/department/get-limit', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get list department, cause by ' + resError.errorMessage)

        return
      }

      const departments = await res.json()

      if (departments !== undefined) {
        setDepartments(departments)
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleRemoveDepartment(event: any) {
    try {
      const id = event.target.id.substring(0, event.target.id.length - 2)

      // const auth = localStorage.getItem('Authorization') as string

      if (!(id == 0 || id == undefined)) {
        const param = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth.token
          },
          body: JSON.stringify({
            id: id
          })
        }

        const res = await fetch(globalVariables.url_admin + '/department/remove', param)

        if (!res.ok) {
          const resError = await res.json()

          handleErrorOpen('Can not delete department, cause by ' + resError.errorMessage)

          return
        }

        const result = await res.json()

        if (result !== undefined && result == true) {
          initData()
          handleAlertOpen('Deleted  department with [' + id + ']')
        }
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleViewUpdateDepartment(event: any) {
    try {
      const id = event.target.id.substring(0, event.target.id.length - 2)

      // const auth = localStorage.getItem('Authorization') as string

      if (!(id == 0 || id == undefined)) {
        const param = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth.token
          },
          body: JSON.stringify({
            id: id
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
          setUpdateDepartment(department)
          toggleUpdateDepartmentDailog()
        }
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleUpdateDepartment() {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          id: updateDepartment.id,
          name: updateDepartment.name,
          description: updateDepartment.description
        })
      }

      const res = await fetch(globalVariables.url_admin + '/department/create-or-update', param)

      if (!res.ok) {
        const resError = await res.json()

        closeUpdateDepartmentDailog()

        handleErrorOpen('Can not update department, cause by ' + resError.errorMessage)

        return
      }

      const department = await res.json()

      if (department !== undefined) {
        closeUpdateDepartmentDailog()
        initData()
        handleAlertOpen('Updated infor for [' + department.name + '] department')
      }
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  // Create account
  function handleViewCreateDepartment() {
    setCreateDepartment({
      id: 0,
      name: '',
      description: '',
      createdAt: '',
      updatedAt: ''
    })

    toggleCreateDepartmentDailog()
  }

  async function handleCreateDepartment() {
    try {
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          name: createDepartment.name,
          description: createDepartment.description
        })
      }

      const res = await fetch(globalVariables.url_admin + '/department/create-or-update', param)

      if (!res.ok) {
        const resError = await res.json()

        closeCreateDepartmentDailog()

        handleErrorOpen('Can not add new department, cause by ' + resError.errorMessage)

        return
      }

      const department = await res.json()

      if (department !== undefined) {
        closeCreateDepartmentDailog()
        initData()
        handleAlertOpen('Added [' + department.name + '] department')
      }
    } catch (error) {
      console.log(error)
      route.replace('/pages/misc/500-server-error')
    }
  }

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
          opacity: departmentsOfPage.length === 0 ? 1 : 0,
          pointerEvents: departmentsOfPage.length === 0 ? 'auto' : 'none',
          transition: 'opacity 0.4s ease'
        }}
      >
        <CircularProgress sx={{ color: '#175ea1' }} size={36} thickness={4} />
        {/* <Icon style={{ color: 'red', fontSize: '40px' }} icon='eos-icons:loading'></Icon> */}
      </div>

      <div style={{ opacity: departmentsOfPage.length ? 1 : 0, transition: 'opacity 0.2s ease' }}>
        <Card>
          <h3 style={{ marginLeft: '24px', marginRight: '24px', marginBottom: '20px', marginTop: '20px' }}>ĐƠN VỊ</h3>
          {/* <CardHeader title='DEPARTMENT' /> */}
          <CardContent className='p-0'>
            <TableContainer
              style={{ maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 340px)' : 'calc(100vh - 300px)' }}

              // style={{
              //   maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 355px)' : 'calc(100vh - 310px)'
              // }}
            >
              <Table style={{ fontSize: '14px' }} className={tableStyles.table} stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Đơn vị</b>
                    </TableCell>
                    <TableCell>
                      <b>Mô tả</b>
                    </TableCell>
                    <TableCell>
                      <b>Ngày tạo</b>
                    </TableCell>
                    <TableCell>
                      <b>Ngày cập nhật</b>
                    </TableCell>
                    <TableCell>
                      <b>Hành động</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentsOfPage.map(department => (
                    <TableRow key={department.id}>
                      <TableCell style={{ fontSize: '14px' }}>{department.name}</TableCell>
                      <TableCell style={{ fontSize: '14px' }}>{department.description} </TableCell>
                      <TableCell style={{ fontSize: '14px' }}>
                        {format(new Date(department.createdAt), 'dd/MM/yyyy hh:mm')}
                      </TableCell>
                      <TableCell style={{ fontSize: '14px' }}>
                        {' '}
                        {format(new Date(department.updatedAt), 'dd/MM/yyyy hh:mm')}
                      </TableCell>

                      <TableCell>
                        <IconButton
                          color='primary'
                          size='small'
                          sx={{ paddingBottom: 0, paddingTop: 0, marginRight: '5px' }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Icon
                              icon='mingcute:delete-line'
                              id={department.id + '_0'}
                              onClick={handleRemoveDepartment}
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
                              width: 18,
                              height: 18,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Icon
                              id={department.id + '_0'}
                              icon='nimbus-edit'
                              onClick={handleViewUpdateDepartment}
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
                style={{ fontSize: '14px' }}
                variant='contained'
                startIcon={<i className='lets-icons-group-add-fill' />}
                onClick={handleViewCreateDepartment}
              >
                Thêm đơn vị
              </Button>
              <Pagination pageSize={6} items={departments} onChangePage={onChangePage} />
            </Box>
          </CardContent>

          {/* Hộp thoại update department  */}
          <Dialog
            fullWidth
            open={updateDepartmentDailog}
            onClose={toggleUpdateDepartmentDailog}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
          >
            <DialogContent>
              <CustomCloseButton onClick={closeUpdateDepartmentDailog}>
                <Icon icon='pajamas:close-xs' fontSize='1.25rem' />
              </CustomCloseButton>
              <Typography variant='h4' sx={{ marginBottom: '5px' }}>
                Department
              </Typography>

              <Box sx={{ overflow: 'auto' }}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Name'
                  placeholder='Enter name'
                  value={updateDepartment.name ?? ''}
                  error={updateDepartment.name === ''}
                  helperText={updateDepartment.name === '' ? 'This field is required.' : ''}
                  onChange={e => setUpdateDepartment({ ...updateDepartment, name: e.target.value })}
                />
                <CustomTextField
                  style={{ marginTop: '15px' }}
                  autoFocus
                  fullWidth
                  label='Description'
                  placeholder='Enter description'
                  value={updateDepartment.description ?? ''}
                  onChange={e => setUpdateDepartment({ ...updateDepartment, description: e.target.value })}
                />
              </Box>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <Button
                  style={{ fontSize: '14px' }}
                  variant='contained'
                  startIcon={<i className='ic-round-save-alt' />}
                  sx={{ mr: 3.5 }}
                  color='primary'
                  onClick={handleUpdateDepartment}
                >
                  Cập nhật
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Hộp thoại thêm mới account */}

          <Dialog
            fullWidth
            open={createDepartmentDailog}
            onClose={toggleCreateDepartmentDailog}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
          >
            <DialogContent>
              <CustomCloseButton onClick={closeCreateDepartmentDailog}>
                <Icon icon='pajamas:close-xs' fontSize='1.25rem' />
              </CustomCloseButton>
              <Typography variant='h4' sx={{ marginBottom: '5px' }}>
                Department
              </Typography>

              <Box sx={{ overflow: 'auto' }}>
                <CustomTextField
                  autoFocus
                  fullWidth
                  label='Name'
                  placeholder='Enter name'
                  value={createDepartment.name ?? ''}
                  onChange={e => setCreateDepartment({ ...createDepartment, name: e.target.value })}
                  error={createDepartment.name === ''}
                  helperText={createDepartment.name === '' ? 'This field is required.' : ''}
                />

                <CustomTextField
                  style={{ marginTop: '15px' }}
                  autoFocus
                  fullWidth
                  label='Description'
                  placeholder='Enter description'
                  value={createDepartment.description ?? ''}
                  onChange={e => setCreateDepartment({ ...createDepartment, description: e.target.value })}
                />
              </Box>
              <div style={{ textAlign: 'center', marginTop: '15px' }}>
                <Button
                  style={{ fontSize: '14px' }}
                  variant='contained'
                  startIcon={<i className='lets-icons-group-add-fill' />}
                  sx={{ mr: 3.5 }}
                  color='primary'
                  onClick={handleCreateDepartment}
                >
                  Thêm
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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

export default DepartmentView
