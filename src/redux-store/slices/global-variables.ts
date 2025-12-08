import { createSlice } from '@reduxjs/toolkit'

export const globalVariablesSlice = createSlice({
  name: 'custom_url',
  initialState: {
    url: 'https://backend.txuyen.com',

    url_user: 'https://backend.txuyen.com/user',
    url_auth: 'https://backend.txuyen.com/auth',

    url_admin: 'https://backend.txuyen.com/admin'

    // url_admin: 'http://localhost:8080',

    // url_auth: 'http://localhost:8081',
    // url_user: 'http://localhost:8082'
  },
  reducers: {}
})

export default globalVariablesSlice.reducer
