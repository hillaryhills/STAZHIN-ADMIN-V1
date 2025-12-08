import { ApiGet, ApiPost, ApiDelete, ApiPut } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    IVaProviderState,
    IFormData
} from './interface'

const initialState: IVaProviderState = {
    vaProviders: null,
    singleVaProvider: null,
    loading: false,
    success: false,
    error: null,
    pagination: null
}


export const getAllVaProviders = createAsyncThunk(
    'vaProvider/getAllVaProviders',
    async (_: void, thunkAPI) => {
        try {
            const response = await ApiGet(`fx-provider`);
            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const createVaProvider = createAsyncThunk(
    'vaProvider/createVaProvider',
    async (data: IFormData, thunkAPI) => {
        try {
            const response = await ApiPost(`fx-provider`, data);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);



export const deleteVaProvider = createAsyncThunk(
    'vaProvider/deleteVaProvider',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiDelete(`fx-provider/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const updateVaProvider = createAsyncThunk<unknown, { id: string; data: IFormData }>(
    'vaProvider/updateVaProvider',
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await ApiPut(`fx-provider/${id}`, data);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const getSingleFxProvider = createAsyncThunk(
    'vaProvider/getSingleFxProvider',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiGet(`fx-provider/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const vaProviderSlice = createSlice({
    name: 'vaProvider',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // get all va providers
        builder.addCase(getAllVaProviders.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(getAllVaProviders.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.success = true;
            state.vaProviders = payload.data;
        });
        builder.addCase(getAllVaProviders.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        // get single va provider
        builder.addCase(getSingleFxProvider.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(getSingleFxProvider.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.success = true;
            state.singleVaProvider = payload.data;
        });
        builder.addCase(getSingleFxProvider.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        // create va provider
        builder.addCase(createVaProvider.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });

        builder.addCase(createVaProvider.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });

        builder.addCase(createVaProvider.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        // delete va provider
        builder.addCase(deleteVaProvider.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });
        builder.addCase(deleteVaProvider.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });
        builder.addCase(deleteVaProvider.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });

        // update va provider
        builder.addCase(updateVaProvider.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        });

        builder.addCase(updateVaProvider.fulfilled, (state) => {
            state.loading = false;
            state.success = true;
        });

        builder.addCase(updateVaProvider.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        });
    },
})


export default vaProviderSlice.reducer;