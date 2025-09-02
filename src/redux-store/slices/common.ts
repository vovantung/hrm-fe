import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface CommonState {
  loading: boolean
  tab: number
  dateFrom: Date | null | undefined
  dateTo: Date | null | undefined
}

const initialState: CommonState = {
  loading: true,
  tab: 0,
  dateFrom: new Date(),
  dateTo: new Date()
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
    }
  }
})

export const { setLoading, clearLoading, setTab, clearTab, setDateFrom, clearDateFrom, setDateTo, clearDateTo } =
  commonSlice.actions
export default commonSlice.reducer
