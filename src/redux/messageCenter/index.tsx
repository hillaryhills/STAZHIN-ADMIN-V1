import { ApiGet } from '../../api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    IMessageCenterState
} from './interface'
import { ITableInput } from '../app/interface'


const initialState: IMessageCenterState = {
    messages: null,
    singleMessage: null,
    loading: false,
    success: false,
    error: null,
    pagination: null
}


export const getAllMessages = createAsyncThunk(
    'message-center/getAllMessages',
    async (data: ITableInput = {}, thunkAPI) => {
        const {
            page = 1,
            limit = 10,
            search = ""
        } = data;

        try {
            const response = await ApiGet(
                `message?page=${page}&limit=${limit}&search=${search}`
            );
            
            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const getMessageByID = createAsyncThunk(
    'message-center/getMessageByID',
    async (id: string, thunkAPI) => {
       
        try {
            const response = await ApiGet(
                `message/${id}`
            );
            return thunkAPI.fulfillWithValue(response);
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);




const messageCenterSlice = createSlice({
    name: 'messageCenter',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        // getAllMessages
        builder.addCase(getAllMessages.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getAllMessages.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.messages = payload.data
            state.pagination = payload.pagination
        })

        builder.addCase(getAllMessages.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

         builder.addCase(getMessageByID.pending, (state) => {
            state.loading = true
            state.error = null
        })
        builder.addCase(getMessageByID.fulfilled, (state, { payload }) => {
            state.loading = false
            state.success = true
            state.singleMessage = payload.data
        })

        builder.addCase(getMessageByID.rejected, (state, { payload }) => {
            state.loading = false
            state.error = payload
        })

    },
})

export default messageCenterSlice.reducer
