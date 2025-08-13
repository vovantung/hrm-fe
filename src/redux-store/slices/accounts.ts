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
  avatar: string
  department: DepartmentDataType
  newpassword: string
}

interface AccountState {
  accountsOfPage: AccountDataType[]
  userLogin: AccountDataType
}

const initialState: AccountState = {
  accountsOfPage: [],
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
    setAccountsOfPage(state, action: PayloadAction<AccountDataType[]>) {
      state.accountsOfPage = action.payload
    },
    setUserLogin(state, action: PayloadAction<AccountDataType>) {
      state.userLogin = action.payload
    },
    clearAccountsOfPage(state) {
      state.accountsOfPage = []
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

export const { setAccountsOfPage, clearAccountsOfPage, setUserLogin, clearUserLogin } = accountsSlice.actions
export default accountsSlice.reducer
