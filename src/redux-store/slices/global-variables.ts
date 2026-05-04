import { createSlice } from '@reduxjs/toolkit'

export const globalVariablesSlice = createSlice({
  name: 'custom_url',
  initialState: {
    url: 'https://backend.txuyen.com',
    url_auth: 'https://backend.txuyen.com/auth',

    url_report: 'https://backend.txuyen.com/report',
    url_saga: 'https://backend.txuyen.com/saga'

    // url_saga: 'http://localhost:8080/saga',
    // url_report: 'http://localhost:8080/report'

    // url_auth: 'http://localhost:8081',
  },
  reducers: {}
})

export default globalVariablesSlice.reducer
