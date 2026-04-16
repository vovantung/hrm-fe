import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

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

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

type RoleDataType = {
  id: string
  name: string
}

interface AccountState {
  accountsOfPage: AccountDataType[]
  accounts: AccountDataType[]
  departments: DepartmentDataType[]
  roles: RoleDataType[]
  userLogined: AccountDataType
}

const initialState: AccountState = {
  accountsOfPage: [],
  accounts: [],
  departments: [],
  roles: [],
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
    setAccounts(state, action: PayloadAction<AccountDataType[]>) {
      state.accounts = action.payload
    },
    setDepartments(state, action: PayloadAction<DepartmentDataType[]>) {
      state.departments = action.payload
    },
    setRoles(state, action: PayloadAction<RoleDataType[]>) {
      state.roles = action.payload
    },
    setUserLogined(state, action: PayloadAction<AccountDataType>) {
      state.userLogined = action.payload
    },
    clearAccountsOfPage(state) {
      state.accountsOfPage = []
    },
    clearAccounts(state) {
      state.accounts = []
    },
    clearDepartments(state) {
      state.departments = []
    },
    clearRoles(state) {
      state.roles = []
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

export const {
  setAccountsOfPage,
  setAccounts,
  setDepartments,
  setRoles,
  clearAccountsOfPage,
  clearAccounts,
  clearDepartments,
  clearRoles,
  setUserLogined,
  clearUserLogined
} = accountsSlice.actions
export default accountsSlice.reducer
