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
  url: string
  uploadedAt: string
  department: DepartmentDataType
}

interface ReportWeeklyState {
  notReportedWeekly: DepartmentDataType[]
  reportedWeekly: WeeklyReportDataType[]
}

const initialState: ReportWeeklyState = {
  notReportedWeekly: [],
  reportedWeekly: []
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
    clearNotReportedWeekly(state) {
      state.notReportedWeekly = []
    },
    clearReportedWeekly(state) {
      state.reportedWeekly = []
    }
  }
})

export const { setNotReportedWeekly, clearNotReportedWeekly, setReportedWeekly, clearReportedWeekly } =
  reportWeeklySlice.actions
export default reportWeeklySlice.reducer
