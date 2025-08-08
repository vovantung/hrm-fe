import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

type Account = {
  id: number
  username: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  department: DepartmentDataType
  newpassword: string
}

interface AccountState {
  lastAccounts: Account[]
}

const initialState: AccountState = {
  lastAccounts: []
}

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLastAccounts(state, action: PayloadAction<Account[]>) {
      state.lastAccounts = action.payload
    },
    clearLastAccounts(state) {
      state.lastAccounts = []
    }
  }
})

export const { setLastAccounts, clearLastAccounts } = accountsSlice.actions
export default accountsSlice.reducer
