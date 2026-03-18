import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

type AccountDataType = {
  id: number
  username: string
  lastName: string
  firstName: string
  email: string
  phoneNumber: string
  avatarUrl: string
  avatarFilename: string
  department: DepartmentDataType
  newpassword: string
}

interface AccountState {
  accountsOfPage: AccountDataType[]
  userLogined: AccountDataType
}

const initialState: AccountState = {
  accountsOfPage: [],
  userLogined: {
    id: 0,
    username: '',
    lastName: '',
    firstName: '',
    email: '',
    phoneNumber: '',
    avatarUrl: '',
    avatarFilename: '',
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
    setAccountsOfPage(state, action: PayloadAction<AccountDataType[]>) {
      state.accountsOfPage = action.payload
    },
    setUserLogined(state, action: PayloadAction<AccountDataType>) {
      state.userLogined = action.payload
    },
    clearAccountsOfPage(state) {
      state.accountsOfPage = []
    },
    clearUserLogined(state) {
      state.userLogined = {
        id: 0,
        username: '',
        lastName: '',
        firstName: '',
        email: '',
        phoneNumber: '',
        avatarUrl: '',
        avatarFilename: '',
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

export const { setAccountsOfPage, clearAccountsOfPage, setUserLogined, clearUserLogined } = accountsSlice.actions
export default accountsSlice.reducer
