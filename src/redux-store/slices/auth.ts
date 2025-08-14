import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  auth: {
    token: string
  }
}

const initialState: AuthState = {
  auth: { token: '' }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ token: string }>) {
      state.auth = action.payload
    },

    clearAuth(state) {
      state.auth = {
        token: ''
      }
    }
  }
})

export const { setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
