import { ApiGet } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    ITransactionState,
    ITableInput
} from './interface'

const initialState: ITransactionState = {
    transactions: null,
    singleTransaction: null,
    loading: false,
    success: false,
    error: null,
    pagination: null
}

export const getAllTransactions = createAsyncThunk(
    'transaction/getAllTransactions',
    async (data: ITableInput = {}, thunkAPI) => {
        const {
            page = 1,
            limit = 10,
            search = "",
            type = "",
            sortBy = "",
            sortOrder = ""
        } = data;

        try {
            const response = await ApiGet(
                `admin/transaction/?page=${page}&limit=${limit}&search=${search}&type=${type}&sortBy=${sortBy}&sortOrder=${sortOrder}`
            );

            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getTransactionById = createAsyncThunk(
    'transaction/getTransactionById',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiGet(`transfer/get-single-payout-byId/${id}`);

            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);



const transactionSlice = createSlice({
    name: 'transaction',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // getAllTransactions
        builder.addCase(getAllTransactions.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getAllTransactions.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.transactions = payload.data
            state.pagination = {
                currentPage: payload.page,
                totalPages: payload.pages,
                total: payload.total
            }
        })

        builder.addCase(getAllTransactions.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


        //getTransactionById
        builder.addCase(getTransactionById.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getTransactionById.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.singleTransaction = payload.data
        })
        builder.addCase(getTransactionById.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


    },
})

export default transactionSlice.reducer