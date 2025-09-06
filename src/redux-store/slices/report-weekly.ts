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
  reportedWeeklyForUserDepartment: WeeklyReportDataType[]
  reportedWeeklyForUserSummary: WeeklyReportDataType[]

  reportedWeeklyListOfPage: WeeklyReportDataType[]
  reportedWeeklyListOfPageDepartment: WeeklyReportDataType[]
  reportedWeeklyListOfPageSummary: WeeklyReportDataType[]
}

const initialState: ReportWeeklyState = {
  notReportedWeekly: [],
  reportedWeeklyForAdmin: [],
  reportedWeeklyForUserDepartment: [],
  reportedWeeklyForUserSummary: [],
  reportedWeeklyListOfPage: [],
  reportedWeeklyListOfPageDepartment: [],
  reportedWeeklyListOfPageSummary: []
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
    setReportedWeeklyListOfPageDepartment(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyListOfPageDepartment = action.payload
    },
    cleaReportedWeeklyListOfPageDepartment(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyListOfPageDepartment = action.payload
    },
    setReportedWeeklyListOfPageSummary(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyListOfPageSummary = action.payload
    },
    cleaReportedWeeklyListOfPageSummary(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyListOfPageSummary = action.payload
    },
    setReportedWeeklyForUserDepartment(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyForUserDepartment = action.payload
    },
    clearReportedWeeklyForUserDepartment(state) {
      state.reportedWeeklyForUserDepartment = []
    },
    setReportedWeeklyForUserSummary(state, action: PayloadAction<WeeklyReportDataType[]>) {
      state.reportedWeeklyForUserSummary = action.payload
    },
    clearReportedWeeklyForUserSummary(state) {
      state.reportedWeeklyForUserSummary = []
    }
  }
})

export const {
  setNotReportedWeekly,
  clearNotReportedWeekly,
  setReportedWeeklyForAdmin,
  clearReportedWeeklyForAdmin,
  setReportedWeeklyForUserDepartment,
  clearReportedWeeklyForUserDepartment,
  setReportedWeeklyForUserSummary,
  clearReportedWeeklyForUserSummary,
  setReportedWeeklyListOfPage,
  clearReportedWeeklyListOfPage,
  setReportedWeeklyListOfPageDepartment,
  cleaReportedWeeklyListOfPageDepartment,
  setReportedWeeklyListOfPageSummary,
  cleaReportedWeeklyListOfPageSummary
} = reportWeeklySlice.actions
export default reportWeeklySlice.reducer
