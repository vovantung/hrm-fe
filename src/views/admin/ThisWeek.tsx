import type { ComponentType, SyntheticEvent } from 'react'
import { Fragment, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import type { SlideProps } from '@mui/material'
import { Alert, Slide, Snackbar, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { startOfWeek, endOfWeek, format } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'

import { setNotReportedWeekly, setReportedWeekly } from '@/redux-store/slices/report-weekly'

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

const ThisWeek = () => {
  const route = useRouter()
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Thứ 2, ngày đầu tuần (hiện tại)
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Chủ nhật, ngày cuối tuần (hiện tại)

  const dispatch = useDispatch()
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)

  const notReportedWeekly = useSelector((state: any) => state.reportWeekly.notReportedWeekly) as DepartmentDataType[]

  // Dữ liệu, cài đặt hông báo...
  const [transition, setTransition] = useState<ComponentType<TransitionProps>>()
  const [message, setMessage] = useState<string>()

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

  useEffect(() => {
    getNotReportedFromTo()
  }, [])

  async function getNotReportedFromTo() {
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

      // Lấy số đơn vị chưa upload báo cáo trong khoảng thời gian from-to
      const res = await fetch(globalVariables.url_admin + '/weekly-report/get-noreport-fromto', param)

      if (!res.ok) {
        const resError = await res.json()

        handleErrorOpen("Can't get list not reported weekly current list, cause by " + resError.errorMessage)

        return
      }

      const notReportedWeekly = await res.json()

      if (notReportedWeekly !== undefined) {
        dispatch(setNotReportedWeekly(notReportedWeekly))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function getWeeklyReportsFromTo() {
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

        handleErrorOpen('Can not get list reported weekly current list, cause by ' + resError.errorMessage)

        // Thông báo hoặc log lỗi ở đây
        return
      }

      const reportedWeekly = await res.json()

      if (reportedWeekly !== undefined) {
        // Danh sách uploadFiles được lưu chia sẽ giữa các thành phần, nên có thể đặt lại state này ở bất cứ component nào
        dispatch(setReportedWeekly(reportedWeekly))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  return (
    <div style={{ margin: lgAbove ? '0px' : undefined }}>
      <div
        style={{
          margin: '0px',
          padding: lgAbove ? '18px' : '14px',
          paddingTop: '10px',
          paddingBottom: '0px',
          textAlign: 'justify'
        }}
      >
        {/* <span style={{ color: '#444477' }}>
          <strong>This week</strong>
        </span> */}
        <strong>Tuần này</strong>
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <span
            style={{
              cursor: 'pointer',
              color: '#0e6ac7ff',

              // color: '#004080',
              textDecoration: 'none',
              fontSize: '13.5px',
              paddingTop: '10px'
            }}
            onClick={getWeeklyReportsFromTo}
          >
            Từ {format(weekStart, 'dd/MM/yyyy')} đến {format(weekEnd, 'dd/MM/yyyy')}
          </span>
        </div>
        {notReportedWeekly.length !== 0 ? (
          <div style={{ marginTop: '10px', marginBottom: '0px', fontSize: '13.5px' }}>
            <div>Các đơn vị chưa gửi báo cáo:</div>

            {notReportedWeekly.map(notReported => (
              <li
                key={notReported.id}
                style={{
                  textDecoration: 'none',
                  fontSize: '13.5px',
                  paddingTop: '10px'
                }}
              >
                <span
                  style={{
                    color: '#a51919ff',
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    paddingTop: '10px'
                  }}
                >
                  {notReported.name}
                </span>
              </li>
            ))}
          </div>
        ) : (
          <span
            style={{
              color: 'green',
              textDecoration: 'none',
              fontSize: '13.5px',
              paddingTop: '10px'
            }}
          >
            Tất cả đơn vị đã hoàn thành gửi báo cáo
          </span>
        )}
      </div>
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
    </div>
  )
}

export default ThisWeek
