import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// import { Card, CardContent, Tooltip, useMediaQuery } from '@mui/material'
import { Tooltip, useMediaQuery } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import { startOfWeek, endOfWeek, format, startOfMonth, endOfMonth, addDays, isBefore } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { setNotReportedWeekly, setReportedWeekly } from '@/redux-store/slices/report-weekly'

// import { setLoading } from '@/redux-store/slices/common'

type ReportedWeeklyDataType = {
  id: number
  filename: string
  url: string
  uploadedAt: string
  department: DepartmentDataType
  originName: string
}

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

type AccountDataType = {
  id: number
  username: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  avatarUrl: string
  department: DepartmentDataType
  newpassword: string
}

const FilterWeeklyReportSidebar = () => {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Thứ 2, ngày đầu tuần (hiện tại)
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Chủ nhật, ngày cuối tuần (hiện tại)
  const notReportedWeekly = useSelector((state: any) => state.reportWeekly.notReportedWeekly) as DepartmentDataType[]

  const route = useRouter()
  const theme = useTheme() as Theme
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))
  const [dateFrom, setDateFrom] = useState<Date | null | undefined>(new Date())
  const [dateTo, setDateTo] = useState<Date | null | undefined>(new Date())
  const [selectedMonth, setSelectedMonth] = useState<Date | null | undefined>(new Date())
  const [weeks, setWeeks] = useState<{ start: Date; end: Date; notReportList: DepartmentDataType[] }[]>([])
  const [init, setInit] = useState<boolean>(false)
  const dispatch = useDispatch()
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)
  const userLogined = useSelector((state: any) => state.accounts.userLogined) as AccountDataType

  const reportedWeeklyList = useSelector((state: any) => state.reportWeekly.reportedWeekly) as ReportedWeeklyDataType[]

  useEffect(() => {
    if (!init) {
      setInit(true)
      getNotReportedFromTo_()
      selectMonthYear(selectedMonth)
    } else {
      handleReportedFromTo()
    }
  }, [dateFrom, dateTo])

  const filterBySelectedWeekly = (event: any) => {
    const input = event.target.id
    const regex = /_(\d{2}\/\d{2}\/\d{4})_(\d{2}\/\d{2}\/\d{4})/
    const match = input.match(regex)

    if (match) {
      const [, startStr, endStr] = match
      const [startDay, startMonth, startYear] = startStr.split('/').map(Number)
      const [endDay, endMonth, endYear] = endStr.split('/').map(Number)
      const start = new Date(startYear, startMonth - 1, startDay)
      const end = new Date(endYear, endMonth - 1, endDay + 1)

      setDateFrom(start)
      setDateTo(end)

      // dispatch(setLoading(true))
    }
  }

  const selectMonthYear = async (date: Date | null | undefined) => {
    if (date) {
      setSelectedMonth(date)

      const generatedWeeks = await getWeeksInMonth(new Date(date.getFullYear(), date.getMonth()))

      setWeeks(generatedWeeks)
    }
  }

  async function getWeeksInMonth(
    date: Date
  ): Promise<{ start: Date; end: Date; notReportList: DepartmentDataType[] }[]> {
    const weeks = []

    let currentWeekStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
    const monthEnd = endOfMonth(date)

    while (isBefore(currentWeekStart, monthEnd) || currentWeekStart.getTime() === monthEnd.getTime()) {
      const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })

      const notReportList = await getNotReportedFromTo(currentWeekStart, currentWeekEnd)

      weeks.push({
        start: currentWeekStart,
        end: currentWeekEnd,
        notReportList: notReportList ?? [] // fallback nếu null
      })

      currentWeekStart = addDays(currentWeekStart, 7)
    }

    return weeks
  }

  async function handleReportedFromTo() {
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
          from: dateFrom?.toISOString(),
          to: dateTo?.toISOString()
        })
      }

      const res = await fetch(globalVariables.url_admin + '/weekly-report/get-fromto', param)

      if (!res.ok) {
        // const rs = await res.json()
        // handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)
        // Thông báo hoặc log lỗi ở đây
        return
      }

      const reportedFromToList = await res.json()

      if (reportedFromToList !== undefined) {
        // Danh sách uploadFiles được lưu chia sẽ giữa các thành phần, nên có thể đặt lại state này ở bất cứ component nào
        dispatch(setReportedWeekly(reportedFromToList))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function getNotReportedFromTo(start: Date, end: Date): Promise<DepartmentDataType[] | null | undefined> {
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
          from: start.toISOString(),
          to: end.toISOString()
        })
      }

      // Lấy số đơn vị chưa upload báo cáo trong khoảng thời gian from-to
      const res = await fetch(globalVariables.url_admin + '/weekly-report/get-noreport-fromto', param)

      if (!res.ok) {
        // const rs = await res.json()
        // handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)
        // Thông báo hoặc log lỗi ở đây
        return
      }

      const notReported = await res.json()

      if (notReported !== undefined) {
        // setNotReportedList(notReported)

        return notReported
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function getNotReportedFromTo_() {
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
        // const resError = await res.json()

        // handleErrorOpen("Can't get list not reported weekly current list, cause by " + resError.errorMessage)

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
    setDateFrom(weekStart)
    setDateTo(weekEnd)
  }

  return (
    <div style={{ margin: lgAbove ? '0px' : undefined, marginTop: '0px' }}>
      <div
        style={{
          margin: '0px',
          padding: lgAbove ? '18px' : '14px',
          paddingTop: '0px',
          paddingBottom: '0px',
          textAlign: 'justify'
        }}
      >
        <span style={{ fontSize: '14.5px' }}>
          Xin chào{' '}
          <span style={{ color: '#be4414dd', fontSize: '14.5px' }}>
            <strong>{userLogined.lastName + ' ' + userLogined.firstName}</strong>
          </span>
          {''}!
        </span>
        <br />
        <span style={{ fontSize: '14.5px' }}>
          Bạn là nhân sự{' '}
          <span style={{ color: '#338844', fontSize: '14.5px' }}>
            <strong>{userLogined.department.name}</strong>
          </span>
        </span>

        <hr
          style={{
            border: 'none',
            borderTop: '0.8px solid #ccc',

            marginTop: '10px',
            marginBottom: '15px'
          }}
        />
        <strong>Tìm kiếm theo thời gian</strong>
        {/* <br /> */}
        <div style={{ marginTop: '00px', marginBottom: '10px' }}>
          <div style={{ fontSize: '14px' }}>
            <AppReactDatepicker
              selected={dateFrom}
              id='from-date'
              onChange={x => setDateFrom(x)}
              placeholderText='Click to select a date'
              customInput={
                <CustomTextField
                  label='Từ ngày'
                  fullWidth
                  InputProps={{
                    sx: { fontSize: '14px' }
                  }}
                />
              }
            />
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            <AppReactDatepicker
              selected={dateTo}
              id='to-date'
              onChange={(y: Date | null | undefined) => setDateTo(y)}
              placeholderText='Click to select a date'
              customInput={
                <CustomTextField
                  label='đến'
                  fullWidth
                  InputProps={{
                    sx: { fontSize: '14px' }
                  }}
                />
              }
            />
          </div>
          <div style={{ marginTop: '10px', fontSize: '14px' }}>
            <AppReactDatepicker
              selected={selectedMonth}
              id='month-picker'
              showMonthYearPicker
              dateFormat='MM/yyyy'
              onChange={(date: Date | null | undefined) => selectMonthYear(date)}
              customInput={
                <CustomTextField
                  label='Các tuần trong tháng'
                  fullWidth
                  InputProps={{
                    sx: { fontSize: '14px' }
                  }}
                />
              }
            />
          </div>

          {weeks.map((week, index) => (
            <li
              key={index}
              style={{
                fontSize: '13.5px',
                paddingTop: '8px',
                display: 'flex',
                justifyContent: 'space-between', // 👈 căn trái phải
                alignItems: 'center'
              }}
              id={'id_' + format(week.start, 'dd/MM/yyyy') + '_' + format(week.end, 'dd/MM/yyyy')}
              onClick={filterBySelectedWeekly}
            >
              <span
                style={{
                  color: '#0e6ac7ff',
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
                id={'id_' + format(week.start, 'dd/MM/yyyy') + '_' + format(week.end, 'dd/MM/yyyy')}
                onClick={filterBySelectedWeekly}
              >
                Từ {format(week.start, 'dd/MM/yyyy')} đến {format(week.start, 'dd/MM/yyyy')}
              </span>

              <Tooltip
                title={
                  week.notReportList.length !== 0 ? (
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                        {week.notReportList.length} đơn vị không gửi báo cáo:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
                        {week.notReportList.map((d, i) => (
                          <li key={i} style={{ fontSize: '13px' }}>
                            {d.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    ''
                  )
                }
                placement='bottom'
                arrow
              >
                <span
                  style={{
                    color: week.notReportList.length !== 0 ? '#a51919ff' : 'green',
                    cursor: week.notReportList.length !== 0 ? 'pointer' : 'unset',
                    whiteSpace: 'nowrap',
                    fontSize: '13px'
                  }}
                >
                  {week.notReportList.length !== 0 ? 'Chưa hoàn thành' : 'Hoàn thành'}
                </span>
              </Tooltip>
            </li>
          ))}
          <hr
            style={{
              border: 'none',
              borderTop: '0.8px solid #ccc',
              marginTop: '10px',
              marginBottom: '15px'
            }}
          />

          <strong>Tuần này</strong>
          <div style={{ marginTop: '5px' }}>
            <span
              style={{
                cursor: 'pointer',
                color: '#0e6ac7ff',

                // color: '#004080',
                textDecoration: 'none',
                fontSize: '13.5px'
              }}
              onClick={getWeeklyReportsFromTo}
            >
              Từ {format(weekStart, 'dd/MM/yyyy')} đến {format(weekEnd, 'dd/MM/yyyy')}
            </span>
          </div>
          {notReportedWeekly.length !== 0 ? (
            <div style={{ marginTop: '5px', marginBottom: '0px', fontSize: '13.5px' }}>
              <div>Các đơn vị chưa gửi báo cáo:</div>

              {notReportedWeekly.map(notReported => (
                <li
                  key={notReported.id}
                  style={{
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    paddingTop: '8px'
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
        <hr
          style={{
            border: 'none',
            borderTop: '0.8px solid #ccc',
            marginTop: '10px',
            marginBottom: '15px'
          }}
        />
        <strong style={{ display: 'flex' }}>Điều kiện, kết quả tìm kiếm</strong>
        <div
          style={{
            backgroundColor: '#d6691039',
            display: 'inline-block',
            borderRadius: '4px',
            paddingLeft: '10px',
            paddingRight: '10px',
            marginTop: '5px',
            marginBottom: '5px'
          }}
        >
          <span style={{ fontSize: '13.5px' }}>
            Từ <strong>{dateFrom ? format(dateFrom, 'dd/MM/yyyy') : ''}</strong> đến{' '}
            <strong>{dateTo ? format(dateTo, 'dd/MM/yyyy') : ''}</strong>
          </span>
        </div>
        <div
          style={{
            backgroundColor: '#d6691039',
            display: 'inline-block',
            borderRadius: '4px',
            paddingLeft: '10px',
            paddingRight: '10px'
          }}
        >
          <span style={{ fontSize: '13.5px' }}>
            Có{' '}
            <strong>
              {reportedWeeklyList.length < 10 ? '0' + reportedWeeklyList.length : reportedWeeklyList.length}
            </strong>{' '}
            báo cáo được tìm thấy
          </span>
        </div>
      </div>
    </div>
  )
}

export default FilterWeeklyReportSidebar
