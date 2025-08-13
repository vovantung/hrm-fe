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

import { format } from 'date-fns'

import { useSelector } from 'react-redux'

import tableStyles from '@core/styles/table.module.css'
import CustomTextField from '@/@core/components/mui/TextField'
import Pagination from '../PaginationTXU'
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
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)
  const [departments, setDepartments] = useState<DepartmentDataType[]>([])
  const [departmentsOfPage, setDepartmentsOfPage] = useState<DepartmentDataType[]>([])

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

  function onChangePage(departmentsOfPage: any) {
    setDepartmentsOfPage(departmentsOfPage) // Cập nhật redux với departmentsOfPage mới
  }

  async function handleRemoveDepartment(event: any) {
    try {
      const id = event.target.id.substring(0, event.target.id.length - 2)
      const auth = localStorage.getItem('Authorization') as string

      if (!(id == 0 || id == undefined)) {
        const param = {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth
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
      const auth = localStorage.getItem('Authorization') as string

      if (!(id == 0 || id == undefined)) {
        const param = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: auth
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
      const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
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
      const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          name: createDepartment.name,
          description: createDepartment.description
        })
      }

      const res = await fetch(globalVariables.url_admin + '/department/create-or-update', param)

      if (!res.ok) {
        const resError = await res.json()

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

  useEffect(() => {
    initData()
  }, [])

  async function initData() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      //  Load Departments
      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
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

  if (departments)
    return (
      <Card>
        <CardHeader title='DEPARTMENT' />
        <CardContent className='p-0'>
          <TableContainer
            style={{ maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 355px)' : 'calc(100vh - 310px)' }}
          >
            <Table className={tableStyles.table} stickyHeader>
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
                    <TableCell style={{ fontSize: '14.5px' }}>{department.name}</TableCell>
                    <TableCell style={{ fontSize: '14.5px' }}>{department.description} </TableCell>
                    <TableCell style={{ fontSize: '14.5px' }}>
                      {format(new Date(department.createdAt), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell style={{ fontSize: '14.5px' }}>
                      {' '}
                      {format(new Date(department.updatedAt), 'dd/MM/yyyy')}
                    </TableCell>

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
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon
                            id={department.id + '_0'}
                            icon='wpf:create-new'
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
              variant='contained'
              startIcon={<i className='mingcute-add-fill' />}
              onClick={handleViewCreateDepartment}
            >
              Thêm đơn vị
            </Button>
            <Pagination pageSize={8} items={departments} onChangePage={onChangePage} />
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
                variant='contained'
                startIcon={<i className='material-symbols-system-update-alt' />}
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
                variant='contained'
                startIcon={<i className='gridicons-create' />}
                sx={{ mr: 3.5 }}
                color='primary'
                onClick={handleCreateDepartment}
              >
                Tạo
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

export default DepartmentView
