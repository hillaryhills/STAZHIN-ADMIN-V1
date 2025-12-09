import { ApiGet, ApiPost, ApiDelete } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    IComplianceState,
    IFormData
} from './interface'



const initialState: IComplianceState = {
    complianceRecords: null,
    singleComplianceRecords: null,
    loading: false,
    success: false,
    error: null,
}



export const getAllComplianceRecord = createAsyncThunk(
    'compliance/getAllComplianceRecord',
    async (_: void, thunkAPI) => {
        try {
            const response = await ApiGet(`kvb/compliance-get`);
            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const createComplianceRecord = createAsyncThunk(
    'compliance/createComplianceRecord',
    async (data: IFormData, thunkAPI) => {
        try {
            const response = await ApiPost(`kvb/compliance`, data);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const deleteComplianceRecord = createAsyncThunk(
    'compliance/deleteComplianceRecord',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiDelete(`kvb/compliance-delete/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);




export const getSingleComplianceRecord = createAsyncThunk(
    'compliance/getSingleComplianceRecord',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiGet(`kvb/compliance-get/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const complianceSlice = createSlice({
    name: 'compliance',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // get all record
        builder.addCase(getAllComplianceRecord.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(getAllComplianceRecord.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.success = true;
            state.complianceRecords = payload.data;
        });
        builder.addCase(getAllComplianceRecord.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        // get single record
        builder.addCase(getSingleComplianceRecord.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(getSingleComplianceRecord.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.success = true;
            state.singleComplianceRecords = payload.data;
        });
        builder.addCase(getSingleComplianceRecord.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        // create va record
        builder.addCase(createComplianceRecord.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });

        builder.addCase(createComplianceRecord.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });

        builder.addCase(createComplianceRecord.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });


        // delete va provider
        builder.addCase(deleteComplianceRecord.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(deleteComplianceRecord.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(deleteComplianceRecord.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

    },
})


export default complianceSlice.reducer;