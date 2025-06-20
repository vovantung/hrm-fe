import { createSlice } from '@reduxjs/toolkit'

export const customSlice = createSlice({
  name: 'custom_url',
  initialState: {
    url: 'https://backend.txuapp.com'

    // url: 'http://localhost:8080'
  },
  reducers: {}
})

export default customSlice.reducer
