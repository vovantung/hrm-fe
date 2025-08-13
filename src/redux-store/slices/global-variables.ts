import { createSlice } from '@reduxjs/toolkit'

export const globalVariablesSlice = createSlice({
  name: 'custom_url',
  initialState: {
    url: 'https://backend.txuyen.com',
    url_hrm: 'https://backend.txuyen.com/hrm',
    url_auth: 'https://backend.txuyen.com/auth',

    url_admin: 'https://backend.txuyen.com/admin'

    // url_admin: 'http://localhost:8080'
  },
  reducers: {}
})

export default globalVariablesSlice.reducer
