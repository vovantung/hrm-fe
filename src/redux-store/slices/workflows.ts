import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type WorkflowDataType = {
  id: number
  name: string
  description: string
  createdAt: string
  updateAt: string
}

interface WorkflowState {
  workflows: WorkflowDataType[]
}

const initialState: WorkflowState = {
  workflows: []
}

const workflowsSlice = createSlice({
  name: 'workflows',
  initialState,
  reducers: {
    setWorkflows(state, action: PayloadAction<WorkflowDataType[]>) {
      state.workflows = action.payload
    },

    clearWorkflows(state) {
      state.workflows = []
    }
  }
})

export const { setWorkflows, clearWorkflows } = workflowsSlice.actions
export default workflowsSlice.reducer
