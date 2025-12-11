import { ApiGet, ApiDelete } from '../../api'
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

export const getSingleUser = createAsyncThunk(
    'user/getSingleUser',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiGet(`user/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);



export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiDelete(`user/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);



export const logoutSession = createAsyncThunk(
    'user/logoutSession',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiDelete(`user/logout-session/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
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


        //get single user
        builder.addCase(getSingleUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getSingleUser.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.singleUser = payload.data
        })

        builder.addCase(getSingleUser.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


        //delete user
        builder.addCase(deleteUser.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(deleteUser.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })

        builder.addCase(deleteUser.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


    },
})

export default userSlice.reducer
