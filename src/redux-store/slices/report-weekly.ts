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
  reportedWeekly: WeeklyReportDataType[]
  reportedWeeklyListOfPage: WeeklyReportDataType[]
}

const initialState: ReportWeeklyState = {
  notReportedWeekly: [],
  reportedWeekly: [],
  reportedWeeklyListOfPage: []
}

const reportWeeklySlice = createSlice({
  name: 'report-weekly',
  initialState,
  reducers: {
    setNotReportedWeekly(state, action: PayloadAction<DepartmentDataType[]>) {
      state.notReportedWeekly = action.payload
    },
    setReportedWeekly(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeekly = action.payload
    },
    setReportedWeeklyListOfPage(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyListOfPage = action.payload
    },
    clearNotReportedWeekly(state) {
      state.notReportedWeekly = []
    },
    clearReportedWeekly(state) {
      state.reportedWeekly = []
    },
    clearReportedWeeklyListOfPage(state) {
      state.reportedWeeklyListOfPage = []
    }
  }
})

export const {
  setNotReportedWeekly,
  clearNotReportedWeekly,
  setReportedWeekly,
  clearReportedWeekly,
  setReportedWeeklyListOfPage,
  clearReportedWeeklyListOfPage
} = reportWeeklySlice.actions
export default reportWeeklySlice.reducer
