import { ApiGet } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    IAppState,
    IDashboardCountQuery
} from './interface'

const initialState: IAppState = {
    data: null,
    loading: false,
    success: false,
    error: null,
}


export const getDashboardCount = createAsyncThunk(
    'app/getDashboardCount',
    async (data: IDashboardCountQuery = {}, thunkAPI) => {
        const {
            nDays = 60
        } = data;

        try {
            const response = await ApiGet(
                `admin/dashboard/count/?nDays=${nDays}`
            );

            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // getDashboardCount
        builder.addCase(getDashboardCount.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getDashboardCount.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.data = payload.data
        })

        builder.addCase(getDashboardCount.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


    },
})

export default appSlice.reducer