'use client'

import type { ComponentType, SyntheticEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Alert, Box, Button, CircularProgress, Link, Portal, Slide, Snackbar } from '@mui/material'

import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import type { SlideProps } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { endOfWeek, format, startOfWeek } from 'date-fns'

import tableStyles from '@core/styles/table.module.css'
import Pagination from '../../admin/PaginationTXU'
import { setReportedWeeklyForUser, setReportedWeeklyListOfPage } from '@/redux-store/slices/report-weekly'
import { useSettings } from '@/@core/hooks/useSettings'
import { setLoading, setTab } from '@/redux-store/slices/common'

type ReportedWeeklyDataType = {
  id: number
  filename: string
  originName: string
  url: string
  uploadedAt: string
  department: DepartmentDataType
  urlReportEx: string
  originNameReportEx: string
  dateReportEx: string
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

const DepartmentReportWeekView = () => {
  const { settings } = useSettings()
  const route = useRouter()
  const [init, setInit] = useState<boolean>(false)
  const [container, setContainer] = useState<Element | null>(null)

  // Lấy ngày đầu tuần và cuối tuần hiện tại
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Thứ 2, ngày đầu tuần
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Chủ nhật, ngày cuối tuần

  // File upload
  const [file, setFile] = useState<File | null>()

  // Danh sách (state) báo cáo tuần lưu dưới dạng chia sẻ giữa các component, dưới đây biến
  // sẽ được lấy để sử dụng trong component này
  const reportedWeeklyList = useSelector(
    (state: any) => state.reportWeekly.reportedWeeklyForUser
  ) as ReportedWeeklyDataType[]

  const reportedWeeklyListOfPage = useSelector(
    (state: any) => state.reportWeekly.reportedWeeklyListOfPage
  ) as ReportedWeeklyDataType[]

  // const [reportedWeeklyListOfPage, setReportedWeeklyListOfPage] = useState<ReportedWeeklyDataType[]>([])

  const loading = useSelector((state: any) => state.common.loading) as boolean

  const auth = useSelector((state: any) => state.auth.auth) as {
    token: string
  }

  // const auth = localStorage.getItem('Authorization') as string

  const dispatch = useDispatch()
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

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
    dispatch(setReportedWeeklyListOfPage(reportedWeeklyOfPage))

    // setReportedWeeklyListOfPage(reportedWeeklyOfPage)
  }

  useEffect(() => {
    if (!init) {
      // Load portal
      setContainer(document.getElementById('toast-root'))

      dispatch(setTab(1))
      setInit(true)

      // Chỉ nạp danh sách báo cáo tuần hiện tại lần đâu tiên khi load trang
      handleReportedWeekly()

      // Sau khi nạp dữ liệu xong, chuyển sang loading sang trạng thái true để dừng màn hình load
      dispatch(setLoading(false))
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
      // const auth = localStorage.getItem('Authorization') as string

      const param = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth.token
        },
        body: JSON.stringify({
          // Date.toISOString() trong nextjs là kiểu chuẩn để truyền cho kiểu java.util.Date ở java backend
          from: weekStart.toISOString(),
          to: weekEnd.toISOString()
        })
      }

      const res = await fetch(globalVariables.url_user + '/weekly-report/get-department-fromto', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get list reported weekly, cause by ' + resError.errorMessage)

        return
      }

      const reportedWeeklys = await res.json()

      if (reportedWeeklys !== undefined) {
        // Danh sách uploadFiles được lưu chia sẽ giữa các thành phần, nên có thể đặt lại state này ở bất cứ component nào
        dispatch(setReportedWeeklyForUser(reportedWeeklys))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  const handleUploadWeeklyReport = async () => {
    if (!file) return

    // const auth = localStorage.getItem('Authorization') as string
    const formData = new FormData()

    formData.append('file', file)

    try {
      const param = {
        method: 'POST',
        headers: {
          Authorization: auth.token
        },
        body: formData
      }

      const res = await fetch(globalVariables.url_user + '/weekly-report/create', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not upload weekly report, cause by ' + resError.errorMessage)

        return
      }

      const reportWeekly = await res.json()

      handleAlertOpen('Upload [' + reportWeekly.originName + '] report success.')
      handleReportedWeekly() // Đặt lại danh sách đã gửi báo cáo để WeeklyReport hiện thị...
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

            // zIndex: 9,
            opacity: reportedWeeklyListOfPage.length === 0 && loading == true ? 1 : 0,
            pointerEvents: reportedWeeklyListOfPage.length === 0 && loading == true ? 'auto' : 'none',
            transition: 'opacity 0.4s ease'
          }}
        >
          <CircularProgress sx={{ color: '#175ea1' }} size={36} thickness={4} />
        </div>

        <div
          style={{
            opacity: reportedWeeklyListOfPage.length === 0 && loading == true ? 0 : 1,
            transition: 'opacity 0.2s ease'
          }}
        >
          <h3 style={{ marginLeft: '24px', marginRight: '24px', marginBottom: '20px', marginTop: '00px' }}>
            BÁO CÁO TUẦN (ĐƠN VỊ)
          </h3>
          <div
            style={{
              height: settings.layout == 'horizontal' ? 'calc(100vh - 320px)' : 'calc(100vh - 276px)',

              minHeight: '80px'
            }}
          >
            <div
              className='p-0'
              style={{
                display: 'flex',
                justifyContent: 'center',
                maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 390px)' : 'calc(100vh - 344px)',
                overflowY: 'auto',
                marginBottom: '0px',
                height: settings.layout == 'horizontal' ? 'calc(100vh - 390px)' : 'calc(100vh - 344px)'
              }}
            >
              <TableContainer

              // style={{ maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 390px)' : 'calc(100vh - 350px)' }}

              // style={{ maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 355px)' : 'calc(100vh - 310px)' }}
              >
                <Table className={tableStyles.table} stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>STT</b>
                      </TableCell>
                      <TableCell>
                        <b>Đơn vị</b>
                      </TableCell>
                      <TableCell>
                        <b>Ngày báo cáo</b>
                      </TableCell>
                      <TableCell>
                        <b>Tên báo cáo</b>
                      </TableCell>
                      <TableCell>
                        <b>Báo cáo tổng hợp</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reportedWeeklyListOfPage.map((reportedWeekly, index) => (
                      <TableRow key={index}>
                        <TableCell
                          style={{
                            fontSize: '14px'
                          }}
                        >
                          {index + 1 < 10 ? '0' + (index + 1) : index + 1}
                        </TableCell>
                        <TableCell style={{ fontSize: '14px' }}>{reportedWeekly.department.name} </TableCell>
                        <TableCell style={{ fontSize: '14px' }}>
                          {format(new Date(reportedWeekly.uploadedAt), 'dd/MM/yyyy hh:mm')}{' '}
                        </TableCell>
                        <TableCell style={{ fontSize: '13.5px' }}>
                          <Link
                            href={reportedWeekly.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            underline='hover'
                            sx={{ display: 'inline-flex', alignItems: 'center' }}
                          >
                            {reportedWeekly.originName}
                          </Link>
                        </TableCell>
                        <TableCell style={{ fontSize: '13.5px' }}>
                          {reportedWeekly.urlReportEx != null ? (
                            <Link
                              href={reportedWeekly.urlReportEx}
                              target='_blank'
                              rel='noopener noreferrer'
                              underline='hover'
                              sx={{ display: 'inline-flex', alignItems: 'center' }}
                            >
                              {/* Xem báo cáo {format(new Date(reportedWeekly.dateReportEx), 'dd/MM/yyyy')} */}
                              {reportedWeekly.originNameReportEx}
                            </Link>
                          ) : (
                            'Chưa báo cáo'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <hr
              style={{
                border: 'none',
                borderTop: '0.6px solid #cccccc97',
                marginTop: '0px'
              }}
            />

            <Box
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                marginLeft: '25px',
                marginTop: '15px',
                marginRight: '20px'
              }}
            >
              <Box alignItems='center'>
                <input type='file' hidden ref={inputRef} onChange={handleChange} />
                <Button
                  style={{ fontSize: '14px', borderRadius: 4, height: '36px' }}
                  startIcon={<i className='icon-park-outline-upload-logs' />}
                  color='primary'
                  size='medium'
                  variant='contained'
                  onClick={handleInputOpen}
                >
                  Tải báo cáo
                </Button>
              </Box>

              {/*
            <Box
              sx={{
                justifyContent: 'space-between',
                display: 'flex',
                marginLeft: '25px',
                marginBottom: '15px',
                marginTop: '15px',
                marginRight: '20px'
              }}
            >
              <Box alignItems='center'>
                <input type='file' hidden ref={inputRef} onChange={handleChange} />
                <Button
                  style={{ fontSize: '13.5px', borderRadius: 4, height: '35px' }}
                  startIcon={<i className='icon-park-outline-upload-logs' />}
                  color='primary'
                  size='medium'
                  variant='contained'
                  onClick={handleInputOpen}
                >
                  Tải báo cáo
                </Button>
              </Box> */}

              <Pagination
                shape='rounded'
                color='primary'
                pageSize={6}
                items={reportedWeeklyList}
                onChangePage={onChangePage}
              />
            </Box>
          </div>
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

export default DepartmentReportWeekView
