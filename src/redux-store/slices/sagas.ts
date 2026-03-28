import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type SagaDataType = {
  id: number
  status: string
  currentStep: string
  history: string
  createdAt: string
  updateAt: string
  completedAt: string
}

interface SagaState {
  sagasOfPage: SagaDataType[]
}

const initialState: SagaState = {
  sagasOfPage: []
}

const sagasSlice = createSlice({
  name: 'sagas',
  initialState,
  reducers: {
    setSagasOfPage(state, action: PayloadAction<SagaDataType[]>) {
      state.sagasOfPage = action.payload
    },

    clearSagasOfPage(state) {
      state.sagasOfPage = []
    }
  }
})

export const { setSagasOfPage, clearSagasOfPage } = sagasSlice.actions
export default sagasSlice.reducer
