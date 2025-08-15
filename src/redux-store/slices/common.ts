import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface CommonState {
  loading: boolean
}

const initialState: CommonState = {
  loading: false
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
    }
  }
})

export const { setLoading, clearLoading } = commonSlice.actions
export default commonSlice.reducer
