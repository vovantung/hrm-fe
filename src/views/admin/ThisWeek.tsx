import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { useMediaQuery } from '@mui/material'
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

const ThisWeek = () => {
  const route = useRouter()
  const theme = useTheme()
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Thứ 2, ngày đầu tuần (hiện tại)
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Chủ nhật, ngày cuối tuần (hiện tại)

  const dispatch = useDispatch()
  const store = useSelector((state: any) => state.customReducer)

  const notReportedWeekly = useSelector((state: any) => state.reportWeekly.notReportedWeekly) as DepartmentDataType[]

  async function getWeeklyReportsFromTo() {
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

      const res = await fetch(store.url_admin + '/weekly-report/get-fromto', p)

      if (!res.ok) {
        // const rs = await res.json()
        // handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)
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

  async function getNotReportedFromTo() {
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
      const res = await fetch(store.url_admin + '/weekly-report/get-noreport-fromto', p)

      if (!res.ok) {
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

  useEffect(() => {
    getNotReportedFromTo()
  }, [])

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
        <span style={{ color: '#444477' }}>
          <strong>This week</strong>
        </span>
        <br />
        <div style={{ marginTop: '10px', marginBottom: '10px' }}>
          <span
            style={{
              cursor: 'pointer',
              color: '#004080',
              textDecoration: 'none',
              fontSize: '14px',
              paddingTop: '10px'
            }}
            onClick={getWeeklyReportsFromTo}
          >
            Từ {format(weekStart, 'dd/MM/yyyy')} đến {format(weekEnd, 'dd/MM/yyyy')}
          </span>
        </div>
        {notReportedWeekly.length !== 0 ? (
          <div style={{ marginTop: '10px', marginBottom: '0px' }}>
            <div>Các đơn vị chưa gửi báo cáo:</div>

            {notReportedWeekly.map(notReported => (
              <li
                key={notReported.id}
                style={{
                  textDecoration: 'none',
                  fontSize: '14px',
                  paddingTop: '10px'
                }}
              >
                <span
                  style={{
                    color: '#a51919ff',
                    textDecoration: 'none',
                    fontSize: '14px',
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
              fontSize: '14px',
              paddingTop: '10px'
            }}
          >
            Tất cả đơn vị đã hoàn thành gửi báo cáo
          </span>
        )}
      </div>
    </div>
  )
}

export default ThisWeek
