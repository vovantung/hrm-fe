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
import { setReportedWeekly } from '@/redux-store/slices/report-weekly'

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

const FilterWeeklyReportSidebar = () => {
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

  useEffect(() => {
    if (!init) {
      setInit(true)
      selectMonthYear(selectedMonth)
    }

    if (dateFrom && dateTo) {
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
    // if (dateFrom == dateTo) return

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

      alert('aa')

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
        <span style={{ color: '#444477' }}>
          <strong>Filter</strong>
        </span>
        <br />
        <div style={{ marginTop: '00px', marginBottom: '10px' }}>
          <div style={{}}>
            <AppReactDatepicker
              selected={dateFrom}
              id='basic-input'
              onChange={x => setDateFrom(x)}
              placeholderText='Click to select a date'
              customInput={<CustomTextField label='From' fullWidth />}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <AppReactDatepicker
              selected={dateTo}
              id='basic-input'
              onChange={(y: Date | null | undefined) => setDateTo(y)}
              placeholderText='Click to select a date'
              customInput={<CustomTextField label='To' fullWidth />}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <AppReactDatepicker
              selected={selectedMonth}
              id='month-picker'
              showMonthYearPicker
              dateFormat='MM/yyyy'
              onChange={(date: Date | null | undefined) => selectMonthYear(date)}
              customInput={<CustomTextField label='Weeks of month' fullWidth />}
            />
          </div>

          {weeks.map((week, index) => (
            <li
              key={index}
              style={{
                fontSize: '14px',
                paddingTop: '10px',
                display: 'flex',
                justifyContent: 'space-between', // 👈 căn trái phải
                alignItems: 'center'
              }}
              id={'id_' + format(week.start, 'dd/MM/yyyy') + '_' + format(week.end, 'dd/MM/yyyy')}
              onClick={filterBySelectedWeekly}
            >
              <span
                style={{
                  cursor: 'pointer'
                }}
                id={'id_' + format(week.start, 'dd/MM/yyyy') + '_' + format(week.end, 'dd/MM/yyyy')}
                onClick={filterBySelectedWeekly}
              >
                Từ{' '}
                <span
                  style={{
                    cursor: 'pointer',
                    color: '#0e6ac7ff',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                  id={'id_' + format(week.start, 'dd/MM/yyyy') + '_' + format(week.end, 'dd/MM/yyyy')}
                  onClick={filterBySelectedWeekly}
                >
                  {format(week.start, 'dd/MM/yyyy')}
                </span>{' '}
                đến{' '}
                <span
                  style={{
                    cursor: 'pointer',
                    color: '#0e6ac7ff',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                  id={'id_' + format(week.start, 'dd/MM/yyyy') + '_' + format(week.end, 'dd/MM/yyyy')}
                  onClick={filterBySelectedWeekly}
                >
                  {format(week.end, 'dd/MM/yyyy')}
                </span>
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
                    whiteSpace: 'nowrap'
                  }}
                >
                  {week.notReportList.length !== 0 ? 'Incomplete' : 'Done'}
                </span>
              </Tooltip>
            </li>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterWeeklyReportSidebar
