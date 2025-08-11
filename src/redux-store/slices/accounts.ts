import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type Account from '@/views/pages/account-settings/account'

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
  avatar: string
  department: DepartmentDataType
  newpassword: string
}

interface AccountState {
  lastAccounts: Account[]
  userLogin: Account
}

const initialState: AccountState = {
  lastAccounts: [],
  userLogin: {
    id: 0,
    username: '',
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    avatar: '',
    department: {
      id: 0,
      name: '',
      description: '',
      createdAt: '',
      updateAt: ''
    },
    newpassword: ''
  }
}

const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLastAccounts(state, action: PayloadAction<Account[]>) {
      state.lastAccounts = action.payload
    },
    setUserLogin(state, action: PayloadAction<Account>) {
      state.userLogin = action.payload
    },
    clearLastAccounts(state) {
      state.lastAccounts = []
    },
    clearUserLogin(state) {
      state.userLogin = {
        id: 0,
        username: '',
        lastName: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        avatar: '',
        department: {
          id: 0,
          name: '',
          description: '',
          createdAt: '',
          updateAt: ''
        },
        newpassword: ''
      }
    }
  }
})

export const { setLastAccounts, clearLastAccounts, setUserLogin, clearUserLogin } = accountsSlice.actions
export default accountsSlice.reducer
