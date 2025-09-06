import { forwardRef, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

// import { Card, CardContent, Tooltip, useMediaQuery } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import { useMediaQuery } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import { startOfWeek, endOfWeek, format, startOfMonth, endOfMonth, addDays, isBefore } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'

import CustomTextField from '@/@core/components/mui/TextField'
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker'
import { setReportedWeeklyForUserDepartment, setReportedWeeklyForUserSummary } from '@/redux-store/slices/report-weekly'
import './week.css'
import { setDateFromForUser, setDateToForUser } from '@/redux-store/slices/common'

// import { setLoading } from '@/redux-store/slices/common'

// type DepartmentDataType = {
//   id: number
//   name: string
//   description: string
//   createdAt: string
//   updateAt: string
// }
type CustomInputProps = TextFieldProps & {
  label: string
  end: Date | number
  start: Date | number
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

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

type ReportedWeeklyDataType = {
  id: number
  filename: string
  url: string
  uploadedAt: string
  department: DepartmentDataType
  originName: string
}

const FilterWeeklyReportSidebar = () => {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Thứ 2, ngày đầu tuần (hiện tại)
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }) // Chủ nhật, ngày cuối tuần (hiện tại)

  const route = useRouter()
  const theme = useTheme() as Theme
  const lgAbove = useMediaQuery(theme.breakpoints.up('lg'))

  // const [dateFrom, setDateFrom] = useState<Date | null | undefined>(new Date())
  // const [dateTo, setDateTo] = useState<Date | null | undefined>(new Date())
  const dateFrom = useSelector((state: any) => state.common.dateFromForUser) as Date | null | undefined
  const dateTo = useSelector((state: any) => state.common.dateToForUser) as Date | null | undefined
  const [selectedMonth, setSelectedMonth] = useState<Date | null | undefined>(new Date())
  const [weeks, setWeeks] = useState<{ start: Date; end: Date }[]>([])
  const [init, setInit] = useState<boolean>(false)
  const dispatch = useDispatch()
  const globalVariables = useSelector((state: any) => state.globalVariablesReducer)
  const tab = useSelector((state: any) => state.common.tab) as number
  const userLogined = useSelector((state: any) => state.accounts.userLogined) as AccountDataType

  const reportedWeeklyList1 = useSelector(
    (state: any) => state.reportWeekly.reportedWeeklyForUserDepartment
  ) as ReportedWeeklyDataType[]

  const reportedWeeklyList2 = useSelector(
    (state: any) => state.reportWeekly.reportedWeeklyForUserSummary
  ) as ReportedWeeklyDataType[]

  useEffect(() => {
    if (!init) {
      setInit(true)
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
      const end = new Date(endYear, endMonth - 1, endDay)

      // Lấy đến cuối ngày cuối cùng
      if (end != null) {
        end.setHours(23, 59, 59, 999)
      }

      dispatch(setDateFromForUser(start))
      dispatch(setDateToForUser(end))

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

  async function getWeeksInMonth(date: Date): Promise<{ start: Date; end: Date }[]> {
    const weeks = []

    let currentWeekStart = startOfWeek(startOfMonth(date), { weekStartsOn: 1 })
    const monthEnd = endOfMonth(date)

    while (isBefore(currentWeekStart, monthEnd) || currentWeekStart.getTime() === monthEnd.getTime()) {
      const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 })

      // const notReportList = await getNotReportedFromTo(currentWeekStart, currentWeekEnd)

      weeks.push({
        start: currentWeekStart,
        end: currentWeekEnd
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

      const res1 = await fetch(globalVariables.url_user + '/weekly-report/get-department-fromto', param)

      if (!res1.ok) {
        // const rs = await res.json()
        // handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)
        // Thông báo hoặc log lỗi ở đây
        return
      }

      const reportedFromToList1 = await res1.json()

      if (reportedFromToList1 !== undefined) {
        // Danh sách uploadFiles được lưu chia sẽ giữa các thành phần, nên có thể đặt lại state này ở bất cứ component nào
        dispatch(setReportedWeeklyForUserDepartment(reportedFromToList1))
      }

      const res2 = await fetch(globalVariables.url_user + '/weekly-report/get-summary-fromto', param)

      if (!res2.ok) {
        // const rs = await res.json()
        // handleErrorOpen('Can not get list department, cause by ' + rs.errorMessage)
        // Thông báo hoặc log lỗi ở đây
        return
      }

      const reportedFromToList2 = await res2.json()

      if (reportedFromToList2 !== undefined) {
        dispatch(setReportedWeeklyForUserSummary(reportedFromToList2))
      }
    } catch (exception) {
      route.replace('/pages/misc/500-server-error')
    }
  }

  async function getWeeklyReportsFromTo() {
    if (weekEnd != null) {
      weekEnd.setHours(23, 59, 59, 999)
    }

    dispatch(setDateFromForUser(weekStart))

    dispatch(setDateToForUser(weekEnd))
  }

  const handleOnChange = (dates: any) => {
    const [start, end] = dates

    // Lấy đến cuối ngày cuối cùng
    if (end != null) {
      end.setHours(23, 59, 59, 999)
    }

    dispatch(setDateFromForUser(start))
    dispatch(setDateToForUser(end))
  }

  const CustomInput = forwardRef((props: CustomInputProps, ref) => {
    const { label, start, end, ...rest } = props

    const startDate = format(start, 'dd/MM/yyyy')
    const endDate = end !== null ? ` - ${format(end, 'dd/MM/yyyy')}` : null

    const value = `${startDate}${endDate !== null ? endDate : ''}`

    return <CustomTextField fullWidth inputRef={ref} {...rest} label={label} value={value} />
  })

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
          <span style={{ color: theme.palette.success.dark, fontSize: '14.5px' }}>
            <strong>{userLogined.lastName + ' ' + userLogined.firstName}</strong>
          </span>
          {''}!
        </span>
        <br />
        <span style={{ fontSize: '14.5px' }}>
          Bạn là nhân sự{' '}
          <div
            style={{
              // backgroundColor: '#b6b4b350',
              display: 'inline-block',
              borderRadius: '2px',
              paddingLeft: '7px',
              paddingRight: '7px',
              paddingTop: '1px',
              paddingBottom: '2px',
              textDecoration: 'underline'
            }}
          >
            <span style={{ fontSize: '14.5px' }}>
              <strong>{userLogined.department.name}</strong>
            </span>
          </div>
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
        <div style={{ marginTop: '5px', marginBottom: '10px' }}>
          <div style={{ fontSize: '14px' }}>
            <AppReactDatepicker
              selectsRange
              endDate={dateTo as Date}
              selected={dateFrom}
              startDate={dateFrom as Date}
              id='date-range-picker'
              onChange={handleOnChange}
              shouldCloseOnSelect={false}
              customInput={
                <CustomInput
                  InputProps={{
                    sx: { fontSize: '14px' }
                  }}
                  label='Khoảng thời gian'
                  start={dateFrom as Date | number}
                  end={dateTo as Date}
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
                className='week-item'
                style={{
                  color: theme.palette.primary.dark,
                  fontSize: '13.5px',
                  cursor: 'pointer'
                }}
                id={'id_' + format(week.start, 'dd/MM/yyyy') + '_' + format(week.end, 'dd/MM/yyyy')}
                onClick={filterBySelectedWeekly}
              >
                Từ {format(week.start, 'dd/MM/yyyy')} đến {format(week.end, 'dd/MM/yyyy')}
              </span>
            </li>
          ))}
        </div>
        <hr
          style={{
            border: 'none',
            borderTop: '0.8px solid #ccc',
            marginTop: '10px',
            marginBottom: '15px'
          }}
        />
        <strong>Tuần này</strong>
        <div style={{ marginTop: '0px', marginBottom: '5px' }}>
          <span
            className='week-item'
            style={{
              cursor: 'pointer',
              color: theme.palette.primary.dark,
              fontSize: '13.5px',
              paddingTop: '0px'
            }}
            onClick={getWeeklyReportsFromTo}
          >
            Từ {format(weekStart, 'dd/MM/yyyy')} đến {format(weekEnd, 'dd/MM/yyyy')}
          </span>
        </div>
        <hr
          style={{
            border: 'none',
            borderTop: '0.8px solid #ccc',
            marginTop: '10px',
            marginBottom: '15px'
          }}
        />
        <strong style={{ display: 'flex' }}>Kết quả tìm kiếm</strong>
        <div
          style={{
            backgroundColor: '#b6b4b350',
            display: 'inline-block',
            borderRadius: '2px',
            paddingLeft: '7px',
            paddingRight: '7px',
            paddingTop: '1px',
            paddingBottom: '1px',
            marginBottom: '3px'
          }}
        >
          <span style={{ fontSize: '13.5px' }}>
            Từ <strong>{dateFrom ? format(dateFrom, 'dd/MM/yyyy') : ''}</strong> đến{' '}
            <strong>{dateTo ? format(dateTo, 'dd/MM/yyyy') : ''}</strong>
          </span>
          <span style={{ fontSize: '13.5px' }}>
            {(reportedWeeklyList1.length == 0 && tab == 1) || (reportedWeeklyList2.length == 0 && tab == 2)
              ? ''
              : ' có '}
            <strong>
              {tab == 1
                ? reportedWeeklyList1?.length == 0
                  ? ' không có báo cáo'
                  : reportedWeeklyList1?.length < 10
                    ? '0' + reportedWeeklyList1.length
                    : reportedWeeklyList1.length
                : tab == 2
                  ? reportedWeeklyList2?.length == 0
                    ? ' không có báo cáo'
                    : reportedWeeklyList2?.length < 10
                      ? '0' + reportedWeeklyList2.length
                      : reportedWeeklyList2.length
                  : ''}
            </strong>{' '}
            {(reportedWeeklyList1.length == 0 && tab == 1) || (reportedWeeklyList2.length == 0 && tab == 2)
              ? ''
              : ' báo cáo'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default FilterWeeklyReportSidebar
