import { ApiGet } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    IUserState
} from './interface'
import { ITableInput } from '../app/interface'

const initialState: IUserState = {
    users: null,
    singleUser: null,
    loading: false,
    success: false,
    error: null,
    pagination: null
}

export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (data: ITableInput = {}, thunkAPI) => {
        const {
            page = 1,
            limit = 10,
            search = ""
        } = data;

        try {
            const response = await ApiGet(
                `user/?page=${page}&limit=${limit}&search=${search}`
            );

            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // getAllUsers
        builder.addCase(getAllUsers.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getAllUsers.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.users = payload.users
            state.pagination = {
                currentPage: payload.currentPage,
                totalPages: payload.totalPages,
                totalUsers: payload.totalUsers
            }
        })

        builder.addCase(getAllUsers.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


    },
})

export default userSlice.reducer
