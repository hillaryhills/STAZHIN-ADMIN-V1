import { ApiGet, ApiPost, ApiDelete, ApiPut } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    IBankMethodState,
    IFormData
} from './interface'
import { ITableInput } from '../app/interface'

const initialState: IBankMethodState = {
    bankMethods: null,
    singleBankMethod: null,
    loading: false,
    success: false,
    error: null,
    pagination: null
}


export const getAllBankMethods = createAsyncThunk(
    'bankMethod/getAllBankMethods',
    async (data: ITableInput = {}, thunkAPI) => {
        const {
            page = 1,
            limit = 10,
            search = ""
        } = data;
        try {
            const response = await ApiGet(
                `bank-method/?page=${page}&limit=${limit}&search=${search}`
            );
            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const deletebankMethod = createAsyncThunk(
    'bankMethod/deletebankMethod',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiDelete(`bank-method/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const createBankMethod = createAsyncThunk(
    'bankMethod/createBankMethod',
    async (data: IFormData, thunkAPI) => {
        try {
            const response = await ApiPost(`bank-method`, data);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const updateBankMethod = createAsyncThunk<unknown, { id: string; data: IFormData }>(
    'bankMethod/updateBankMethod',
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await ApiPut(`bank-method/${id}`, data);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getSingleBankMethod = createAsyncThunk(
    'bankMethod/getSingleBankMethod',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiGet(`bank-method/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


const bankMethodSlice = createSlice({
    name: 'bankMethod',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // getAllBankMethods
        builder.addCase(getAllBankMethods.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getAllBankMethods.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.bankMethods = payload.data
            state.pagination = {
                currentPage: payload.pagination.page,
                totalPages: payload.pagination.totalPages,
                totalBankMethods: payload.pagination.total
            }
        })
        builder.addCase(getAllBankMethods.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

        // deletebankMethod
        builder.addCase(deletebankMethod.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(deletebankMethod.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })
        builder.addCase(deletebankMethod.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

        // createBankMethod
        builder.addCase(createBankMethod.pending, (state) => {
            state.loading = true
            state.error = null
        })

        builder.addCase(createBankMethod.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })

        builder.addCase(createBankMethod.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

        // updateBankMethod
        builder.addCase(updateBankMethod.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(updateBankMethod.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })
        builder.addCase(updateBankMethod.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

        // getSingleBankMethod
        builder.addCase(getSingleBankMethod.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getSingleBankMethod.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.singleBankMethod = payload.data
        })
        builder.addCase(getSingleBankMethod.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })
    }
});

export default bankMethodSlice.reducer;