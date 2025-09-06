import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

type WeeklyReportDataType = {
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

interface ReportWeeklyState {
  notReportedWeekly: DepartmentDataType[]
  reportedWeeklyForAdmin: WeeklyReportDataType[]
  reportedWeeklyForUser: WeeklyReportDataType[]

  reportedWeeklyListOfPage: WeeklyReportDataType[]
}

const initialState: ReportWeeklyState = {
  notReportedWeekly: [],
  reportedWeeklyForAdmin: [],
  reportedWeeklyForUser: [],
  reportedWeeklyListOfPage: []
}

const reportWeeklySlice = createSlice({
  name: 'report-weekly',
  initialState,
  reducers: {
    setNotReportedWeekly(state, action: PayloadAction<DepartmentDataType[]>) {
      state.notReportedWeekly = action.payload
    },
    setReportedWeeklyForAdmin(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyForAdmin = action.payload
    },
    setReportedWeeklyListOfPage(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyListOfPage = action.payload
    },
    clearNotReportedWeekly(state) {
      state.notReportedWeekly = []
    },
    clearReportedWeeklyForAdmin(state) {
      state.reportedWeeklyForAdmin = []
    },
    clearReportedWeeklyListOfPage(state) {
      state.reportedWeeklyListOfPage = []
    },
    setReportedWeeklyForUser(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyForUser = action.payload
    },
    clearReportedWeeklyForUser(state) {
      state.reportedWeeklyForUser = []
    }
  }
})

export const {
  setNotReportedWeekly,
  clearNotReportedWeekly,
  setReportedWeeklyForAdmin,
  clearReportedWeeklyForAdmin,
  setReportedWeeklyForUser,
  clearReportedWeeklyForUser,
  setReportedWeeklyListOfPage,
  clearReportedWeeklyListOfPage
} = reportWeeklySlice.actions
export default reportWeeklySlice.reducer
