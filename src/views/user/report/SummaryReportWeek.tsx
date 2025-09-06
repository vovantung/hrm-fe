'use client'

import type { ComponentType, SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Alert, Box, CircularProgress, Link, Portal, Slide, Snackbar } from '@mui/material'
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
import { setReportedWeeklyForUserSummary, setReportedWeeklyListOfPageSummary } from '@/redux-store/slices/report-weekly'
import { useSettings } from '@/@core/hooks/useSettings'
import { setDateFromForUser, setDateToForUser, setLoading, setTab } from '@/redux-store/slices/common'

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

const SummaryReportWeekView = () => {
  const { settings } = useSettings()
  const route = useRouter()
  const [container, setContainer] = useState<Element | null>(null)

  // Lấy ngày đầu tuần và cuối tuần hiện tại
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Thứ 2, ngày đầu tuần
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Chủ nhật, ngày cuối tuần

  // Danh sách (state) báo cáo tuần lưu dưới dạng chia sẻ giữa các component, dưới đây biến
  // sẽ được lấy để sử dụng trong component này
  const reportedWeeklyList = useSelector(
    (state: any) => state.reportWeekly.reportedWeeklyForUserSummary
  ) as ReportedWeeklyDataType[]

  const reportedWeeklyListOfPage = useSelector(
    (state: any) => state.reportWeekly.reportedWeeklyListOfPageSummary
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
    dispatch(setReportedWeeklyListOfPageSummary(reportedWeeklyOfPage))

    // setReportedWeeklyListOfPage(reportedWeeklyOfPage)
  }

  useEffect(() => {
    // Load portal
    setContainer(document.getElementById('toast-root'))

    dispatch(setTab(2))

    // Chỉ nạp danh sách báo cáo tuần hiện tại lần đâu tiên khi load trang
    handleReportedWeekly()

    // Sau khi nạp dữ liệu xong, chuyển sang loading sang trạng thái true để dừng màn hình load
    dispatch(setLoading(false))
  }, [])

  async function handleReportedWeekly() {
    if (reportedWeeklyList.length !== 0) return
    dispatch(setDateFromForUser(weekStart))
    dispatch(setDateToForUser(weekEnd))

    try {
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

      const res = await fetch(globalVariables.url_user + '/weekly-report/get-summary-fromto', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen('Can not get list reported weekly, cause by ' + resError.errorMessage)

        return
      }

      const reportedWeeklys = await res.json()

      if (reportedWeeklys !== undefined) {
        // Danh sách uploadFiles được lưu chia sẽ giữa các thành phần, nên có thể đặt lại state này ở bất cứ component nào

        dispatch(setReportedWeeklyForUserSummary(reportedWeeklys))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
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
          <div
            style={{
              height: settings.layout == 'horizontal' ? 'calc(100vh - 266px)' : 'calc(100vh - 226px)',
              minHeight: '114px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                maxHeight: settings.layout == 'horizontal' ? 'calc(100vh - 359px)' : 'calc(100vh - 318px)',
                minHeight: settings.layout == 'horizontal' ? '23px' : '23px',
                overflowY: 'auto',

                marginBottom: '20px',
                height: settings.layout == 'horizontal' ? 'calc(100vh - 359px)' : 'calc(100vh - 318px)'
              }}
            >
              <TableContainer>
                <h3 style={{ marginLeft: '24px', marginRight: '24px', marginBottom: '20px', marginTop: '00px' }}>
                  BÁO CÁO TỔNG HỢP
                </h3>
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
                        <b>Báo cáo tổng hợp</b>
                      </TableCell>
                      <TableCell>
                        <b>Báo cáo đơn vị</b>
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
                        <TableCell style={{ fontSize: '14px' }}>
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
                        <TableCell style={{ fontSize: '14px' }}>
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
                marginRight: '20px'
              }}
            >
              <div
                style={{
                  margin: '0px',
                  padding: '0px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}
                ></div>
              </div>

              <Box
                sx={{
                  height: '70px'
                }}
              ></Box>

              <div
                style={{
                  margin: '0px',
                  padding: '0px'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Pagination
                    shape='rounded'
                    color='primary'
                    pageSize={8}
                    items={reportedWeeklyList}
                    onChangePage={onChangePage}
                  />
                </div>
              </div>
            </Box>
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
        </div>
      </div>
    )
}

export default SummaryReportWeekView
