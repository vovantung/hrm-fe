import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface CommonState {
  loading: boolean
  tab: number
  dateFrom: Date | null | undefined
  dateTo: Date | null | undefined
  dateFromForUser: Date | null | undefined
  dateToForUser: Date | null | undefined
}

const initialState: CommonState = {
  loading: true,
  tab: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  dateFromForUser: new Date(),
  dateToForUser: new Date()
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    clearLoading(state) {
      state.loading = false
    },
    setTab(state, action: PayloadAction<number>) {
      state.tab = action.payload
    },
    clearTab(state) {
      state.tab = 0
    },
    setDateFrom(state, action: PayloadAction<Date | null | undefined>) {
      state.dateFrom = action.payload
    },
    clearDateFrom(state) {
      state.dateFrom = null
    },
    setDateTo(state, action: PayloadAction<Date | null | undefined>) {
      state.dateTo = action.payload
    },
    clearDateTo(state) {
      state.dateTo = null
    },
    setDateFromForUser(state, action: PayloadAction<Date | null | undefined>) {
      state.dateFromForUser = action.payload
    },
    clearDateFromForUser(state) {
      state.dateFromForUser = null
    },
    setDateToForUser(state, action: PayloadAction<Date | null | undefined>) {
      state.dateToForUser = action.payload
    },
    clearDateToForUser(state) {
      state.dateToForUser = null
    }
  }
})

export const {
  setLoading,
  clearLoading,
  setTab,
  clearTab,
  setDateFrom,
  clearDateFrom,
  setDateTo,
  clearDateTo,
  setDateFromForUser,
  clearDateFromForUser,
  setDateToForUser,
  clearDateToForUser
} = commonSlice.actions
export default commonSlice.reducer
