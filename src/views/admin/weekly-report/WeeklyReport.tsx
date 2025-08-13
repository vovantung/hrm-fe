'use client'

import type { ComponentType, SyntheticEvent } from 'react'
import { Fragment, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Alert, Box, Button, IconButton, Link, Slide, Snackbar } from '@mui/material'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import type { SlideProps } from '@mui/material'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDispatch, useSelector } from 'react-redux'
import { endOfWeek, format, startOfWeek } from 'date-fns'

import tableStyles from '@core/styles/table.module.css'
import Pagination from '../PaginationTXU'
import { setNotReportedWeekly, setReportedWeekly } from '@/redux-store/slices/report-weekly'
import { useSettings } from '@/@core/hooks/useSettings'

type ReportedWeeklyDataType = {
  id: number
  filename: string
  url: string
  uploadedAt: string
  department: DepartmentDataType
}

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

type TransitionProps = Omit<SlideProps, 'direction'>

const TransitionUp = (props: TransitionProps) => {
  return <Slide {...props} direction='down' />
}

const WeeklyReportView = () => {
  const { settings } = useSettings()
  const route = useRouter()
  const [init, setInit] = useState<boolean>(false)

  // Lấy ngày đầu tuần và cuối tuần hiện tại
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Thứ 2, ngày đầu tuần
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Chủ nhật, ngày cuối tuần

  // File upload
  const [file, setFile] = useState<File | null>()

  // Danh sách (state) báo cáo tuần lưu dưới dạng chia sẻ giữa các component, dưới đây biến
  // sẽ được lấy để sử dụng trong component này
  const reportedWeeklyList = useSelector((state: any) => state.reportWeekly.reportedWeekly) as ReportedWeeklyDataType[]

  const dispatch = useDispatch()
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  const [reportedWeeklyListOfPage, setReportedWeeklyListOfPage] = useState<ReportedWeeklyDataType[]>([])

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

  function onChangePage(reportedWeeklyOfPage: any) {
    setReportedWeeklyListOfPage(reportedWeeklyOfPage)
  }

  async function handleReportedWeekly() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p2 = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          // Date.toISOString() trong nextjs là kiểu chuẩn để truyền cho kiểu java.util.Date ở java backend
          from: weekStart.toISOString(),
          to: weekEnd.toISOString()
        })
      }

      const res = await fetch(globalVariables.url_admin + '/weekly-report/get-fromto', p2)

      if (!res.ok) {
        // const rs = await res.json()
        // handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)
        // Thông báo hoặc log lỗi ở đây
        return
      }

      const uploadFiles = await res.json()

      if (uploadFiles !== undefined) {
        // Danh sách uploadFiles được lưu chia sẽ giữa các thành phần, nên có thể đặt lại state này ở bất cứ component nào
        dispatch(setReportedWeekly(uploadFiles))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleNotReportedWeekly() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const p = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth
        },
        body: JSON.stringify({
          // Date.toISOString() trong nextjs là kiểu chuẩn để truyền cho kiểu java.util.Date ở java backend
          from: weekStart.toISOString(),
          to: weekEnd.toISOString()
        })
      }

      // Lấy số đơn vị chưa upload báo cáo trong khoảng thời gian from-to
      const res = await fetch(globalVariables.url_admin + '/weekly-report/get-noreport-fromto', p)

      if (!res.ok) {
        // const rs = await res.json()
        // handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)
        // Thông báo hoặc log lỗi ở đây
        return
      }

      const notReported = await res.json()

      if (notReported !== undefined) {
        // Thống kê các đơn vị chưa gửi báo cáo trong tuần, đây lad state lưu thông tin chung được chia sẽ cho tất cả các component
        dispatch(setNotReportedWeekly(notReported))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  useEffect(() => {
    if (!init) {
      setInit(true)
      handleReportedWeekly()
    }

    if (file) {
      handleUploadWeeklyReport()
    }
  }, [file?.name])

  const handleUploadWeeklyReport = async () => {
    if (!file) return

    const formData = new FormData()
    const auth = localStorage.getItem('Authorization') as string

    formData.append('file', file)

    try {
      const p = {
        method: 'POST',
        headers: {
          Authorization: auth
        },
        body: formData
      }

      const res = await fetch(globalVariables.url_admin + '/weekly-report/create', p)

      if (!res.ok) {
        const rs = await res.json()

        handleErrorOpen('Can not upload weekly report, cause by ' + rs.errorMessage)

        return
      }

      const rs = await res.json()

      handleAlertOpen('Upload weekly report success. Url file: ' + rs.url)
      handleReportedWeekly() // Đặt lại danh sách đã gửi báo cáo để WeeklyReport hiện thị...
      handleNotReportedWeekly() // Đặt lại danh sách chưa gửi báo cáo tuần, component ThisWeek sẽ sử dụng danh sách này để hiện thị thông báo...
    } catch (error) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const handleInputOpen = () => {
    inputRef.current?.click() // click ẩn input
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file_ = event.target.files?.[0]

    // alert(file_?.name)
    if (!file_) return // Người dùng bấm Cancel

    setFile(file_)

    // handleUploadWeeklyReport()

    if (inputRef.current) {
      inputRef.current.value = '' // Quan trọng
    }
  }

  if (reportedWeeklyList)
    return (
      <Card>
        <CardHeader title='WEEKLY REPORT' />
        <CardContent className='p-0'>
          <TableContainer
            style={{ maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 355px)' : 'calc(100vh - 310px)' }}
          >
            <Table className={tableStyles.table} stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Department</b>
                  </TableCell>
                  <TableCell>
                    <b>Uploaded at</b>
                  </TableCell>
                  <TableCell>
                    <b>File name</b>
                  </TableCell>
                  <TableCell>
                    <b>Action</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportedWeeklyListOfPage.map(reportedWeekly => (
                  <TableRow key={reportedWeekly.id}>
                    <TableCell style={{ fontSize: '14.5px' }}>{reportedWeekly.department.name} </TableCell>
                    <TableCell style={{ fontSize: '14.5px' }}>
                      {format(new Date(reportedWeekly.uploadedAt), 'dd/MM/yyyy')}{' '}
                    </TableCell>
                    <TableCell style={{ fontSize: '14px' }}>
                      <Link
                        href={reportedWeekly.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        underline='hover'
                        sx={{ display: 'inline-flex', alignItems: 'center' }}
                      >
                        {reportedWeekly.filename}
                      </Link>
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
                            icon='fluent:person-delete-16-regular'
                            id={reportedWeekly.id + '_0'}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </Box>
                      </IconButton>

                      <IconButton
                        color='primary'
                        size='small'
                        sx={{ paddingBottom: 0, paddingTop: 0, marginLeft: '5px' }}
                      ></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
        </CardContent>
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
          <Box display='flex' alignItems='center'>
            <input type='file' hidden ref={inputRef} onChange={handleChange} />
            <Button
              variant='contained'
              size='medium'
              startIcon={<i className='line-md-uploading-loop' />}
              onClick={handleInputOpen}
            >
              Upload report
            </Button>
          </Box>

          <Pagination
            shape='rounded'
            color='primary'
            pageSize={8}
            items={reportedWeeklyList}
            onChangePage={onChangePage}
          />
        </Box>
      </Card>
    )
}

export default WeeklyReportView
