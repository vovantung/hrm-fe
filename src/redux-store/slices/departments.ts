import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type DepartmentDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

interface DepartmentState {
  departmentsOfPage: DepartmentDataType[]
}

const initialState: DepartmentState = {
  departmentsOfPage: []
}

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setDepartmentsOfPage(state, action: PayloadAction<DepartmentDataType[]>) {
      state.departmentsOfPage = action.payload
    },

    clearDepartmentsOfPage(state) {
      state.departmentsOfPage = []
    }
  }
})

export const { setDepartmentsOfPage, clearDepartmentsOfPage } = departmentsSlice.actions
export default departmentsSlice.reducer
