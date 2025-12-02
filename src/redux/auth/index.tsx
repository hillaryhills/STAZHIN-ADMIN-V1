import { ApiPostNoAuth } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  IAuthState,
  ILoginInput,
} from './interface'
import { showToast } from '../../utils/toast'
import { IApiError } from '../../api/interface'

const initialState: IAuthState = {
  loading: false,
  success: false,
  error: null,
  forgotPasswordData: null,
}



export const login = createAsyncThunk('auth/login', async (data: ILoginInput, thunkAPI) => {
  try {
    const response = await ApiPostNoAuth('admin/login', data)
    if (response) {
      return thunkAPI.fulfillWithValue(response)
    }
  } catch (error) {
    showToast('error', (error as IApiError)?.response?.data?.message as string, 'Login Failed')
    return thunkAPI.rejectWithValue(error)
  }
})


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(login.fulfilled, (state) => {
      state.loading = false
      state.success = true
    })
    builder.addCase(login.rejected, (state, { payload }) => {
      state.loading = false
      state.error = payload
    })

  },
})

export default authSlice.reducer
