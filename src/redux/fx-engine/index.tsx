import { ApiGet, ApiPost, ApiDelete, ApiPut } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    IFxEngineState,
    IFormData
} from './interface'

const initialState: IFxEngineState = {
    fxEngines: null,
    singleFxEngine: null,
    loading: false,
    success: false,
    error: null,
    pagination: null
}


export const getAllFxEngines = createAsyncThunk(
    'fx-engine/getAllFxEngines',
    async (_: void, thunkAPI) => {
        try {
            const response = await ApiGet(`fx`);

            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const createFxEngine = createAsyncThunk(
    'fx-engine/createFxEngine',
    async (data: IFormData, thunkAPI) => {
        try {
            const response = await ApiPost(`fx`, data);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteFxEngine = createAsyncThunk(
    'fx-engine/deleteFxEngine',
    async (id: string, thunkAPI) => {
        try {
            const response = await ApiDelete(`fx/${id}`);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


export const updateFxEngine = createAsyncThunk<unknown, { id: string; data: IFormData }>(
    'fx-engine/updateFxEngine',
    async ({ id, data }, thunkAPI) => {
        try {
            const response = await ApiPut(`fx/${id}`, data);
            return thunkAPI.fulfillWithValue(response);
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);


const fxEngineSlice = createSlice({
    name: 'fxEngine',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // getAllFxEngines
        builder.addCase(getAllFxEngines.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getAllFxEngines.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.fxEngines = payload.data
        })

        builder.addCase(getAllFxEngines.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

        // createFxEngine
        builder.addCase(createFxEngine.pending, (state) => {
            state.loading = true
            state.error = null
        })

        builder.addCase(createFxEngine.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })

        builder.addCase(createFxEngine.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

        // deleteFxEngine
        builder.addCase(deleteFxEngine.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(deleteFxEngine.fulfilled, (state, action) => {
            state.fxEngines = state.fxEngines?.filter(item => item._id !== action.payload._id) ?? null;
        });


        builder.addCase(deleteFxEngine.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })


        // updateFxEngine
        builder.addCase(updateFxEngine.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(updateFxEngine.fulfilled, (state) => {
            state.loading = false
            state.success = true
        })

        builder.addCase(updateFxEngine.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

    },
})

export default fxEngineSlice.reducer
