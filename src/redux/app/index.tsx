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
    countries: null,
    fxProviders: null
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


export const getFxProviders = createAsyncThunk(
    'app/getFxProviders',
    async (_: void, thunkAPI) => {

        try {
            const response = await ApiGet(`fx-provider`);

            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);



export const getCountries = createAsyncThunk(
    'app/getCountries',
    async (_: void, thunkAPI) => {
        try {
            const response = await ApiGet(`country`);

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


        // getFxProviders
        builder.addCase(getFxProviders.pending, (state) => {
            state.loading = true
            state.error = null
        })

        builder.addCase(getFxProviders.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.fxProviders = payload.data
        })

        builder.addCase(getFxProviders.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


        // getCountries
        builder.addCase(getCountries.pending, (state) => {
            state.loading = true
            state.error = null
        })

        builder.addCase(getCountries.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.countries = payload.data
        })

        builder.addCase(getCountries.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


    },
})

export default appSlice.reducer