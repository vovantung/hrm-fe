// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import chatReducer from '@/redux-store/slices/chat'
import calendarReducer from '@/redux-store/slices/calendar'
import kanbanReducer from '@/redux-store/slices/kanban'
import emailReducer from '@/redux-store/slices/email'
import globalVariablesReducer from '@/redux-store/slices/global-variables'
import postReducer from '@/redux-store/slices/post'
import accountsReducer from '@/redux-store/slices/accounts'
import authReducer from '@/redux-store/slices/auth'
import departmentsReducer from '@/redux-store/slices/departments'
import reportWeeklyReducer from '@/redux-store/slices/report-weekly'

export const store = configureStore({
  reducer: {
    chatReducer,
    calendarReducer,
    kanbanReducer,
    emailReducer,
    globalVariablesReducer,
    post: postReducer,
    accounts: accountsReducer,
    departments: departmentsReducer,
    reportWeekly: reportWeeklyReducer,
    auth: authReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
