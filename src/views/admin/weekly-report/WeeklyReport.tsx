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

  useEffect(() => {
    if (!init) {
      setInit(true)

      // Chỉ nạp danh sách báo cáo tuần hiện tại lần đâu tiên khi load trang
      handleReportedWeekly()
    } else {
      // Để chắc chắn không thực hiện thêm báo cáo (upload file) lần đầu tiên khi nạp trang
      if (file) {
        // Để chắc chắn chỉ thêm báo cáo khi file đã có giá trị
        handleUploadWeeklyReport()
      }
    }
  }, [file?.name]) // Để chắc chắn mỗi khi file báo cáo được chọn mới, thì sẽ thực hiện thêm báo cáo
  // Và điều này cũng sẽ thực hiện thêm báo cáo kể cả khi file chuyển từ trạng thái có giá trị sang trạng thái null.
  // Tuy nhiên, với điều kiện if(file) đã ngăn việc thêm báo cáo với giá trị null
  // Việc đặt lại giá trị null cho file đã được thực hiện sau mỗi lần thêm báo cáo nên dù có chọn lại đúng file cũ thì báo cáo vẫn được xem là báo cáo mới
  // do có sự thay đổi giá trị từ có file sang null, và từ null sang có file...

  async function handleReportedWeekly() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const param = {
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

      const res = await fetch(globalVariables.url_admin + '/weekly-report/get-fromto', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get list reported weekly, cause by ' + resError.errorMessage)

        return
      }

      const reportedWeeklys = await res.json()

      if (reportedWeeklys !== undefined) {
        // Danh sách uploadFiles được lưu chia sẽ giữa các thành phần, nên có thể đặt lại state này ở bất cứ component nào
        dispatch(setReportedWeekly(reportedWeeklys))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function handleNotReportedWeekly() {
    try {
      const auth = localStorage.getItem('Authorization') as string

      const param = {
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

      // Lấy số đơn vị chưa upload báo cáo trong tuần hiện tại
      const res = await fetch(globalVariables.url_admin + '/weekly-report/get-noreport-fromto', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get list department, cause by ' + resError.errorMessage)

        return
      }

      const notReportedCurrentWeeklyList = await res.json()

      if (notReportedCurrentWeeklyList !== undefined) {
        // Thống kê các đơn vị chưa gửi báo cáo trong tuần hiện tại, đây là state lưu thông tin chung được chia sẽ cho tất cả các component
        dispatch(setNotReportedWeekly(notReportedCurrentWeeklyList))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  const handleUploadWeeklyReport = async () => {
    if (!file) return
    const auth = localStorage.getItem('Authorization') as string
    const formData = new FormData()

    formData.append('file', file)

    try {
      const param = {
        method: 'POST',
        headers: {
          Authorization: auth
        },
        body: formData
      }

      const res = await fetch(globalVariables.url_admin + '/weekly-report/create', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not upload weekly report, cause by ' + resError.errorMessage)

        return
      }

      const reportWeekly = await res.json()

      handleAlertOpen('Upload weekly report success. Url file: ' + reportWeekly.url)
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
    const file = event.target.files?.[0] // Lấy file đầu tiên được chọn

    if (!file) return // Người dùng bấm Cancel, file không tồn tại, thoát và không làm gì thêm

    setFile(file) // Khi file được chọn và có giá trị, đặt file vào state file, trạng thái file thay đổi
    // nên kích hoạt hàm thêm báo cáo với file được chọn (đã đặt trong useEffect())

    if (inputRef.current) {
      inputRef.current.value = ''

      // Sau khi đã kích hoạt hàm thêm báo cáo với file được chọn, đặt lại giá trị rỗng để đưa filename về giá trị rỗng
      // Việc này có làm thay đổi state file, tuy nhiên không làm lại hàm xử lý thêm báo cáo vì giá trị file được đặt giá trị null
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
                            icon='mingcute:delete-line'
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

export default WeeklyReportView
