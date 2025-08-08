// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import chatReducer from '@/redux-store/slices/chat'
import calendarReducer from '@/redux-store/slices/calendar'
import kanbanReducer from '@/redux-store/slices/kanban'
import emailReducer from '@/redux-store/slices/email'
import customReducer from '@/redux-store/slices/custom'
import postReducer from '@/redux-store/slices/post'
import accountsReducer from '@/redux-store/slices/accounts'
import reportWeeklyReducer from '@/redux-store/slices/report-weekly'

export const store = configureStore({
  reducer: {
    chatReducer,
    calendarReducer,
    kanbanReducer,
    emailReducer,
    customReducer,
    post: postReducer,
    accounts: accountsReducer,
    reportWeekly: reportWeeklyReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
