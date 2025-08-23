import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface CommonState {
  loading: boolean
  tab: number
}

const initialState: CommonState = {
  loading: true,
  tab: 0
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
    }
  }
})

export const { setLoading, clearLoading, setTab, clearTab } = commonSlice.actions
export default commonSlice.reducer
