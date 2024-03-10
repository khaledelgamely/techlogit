import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCurrency = createAsyncThunk("currency/getAll", async () => {
    const  {data}  = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
    return  data.rates
});

const initialState = {
    currency: {},
    selected:'USD'
}

const currencySlice = createSlice({
    name: "currency",
    initialState,
    reducers: { 
        selectCurrenct: (state, action) => {
            state.selected = action.payload;
        },
    },
    extraReducers: {
        [fetchCurrency.fulfilled]: (state, action) => {
            state.currency=action.payload
            state.selected='USD'
        }
    }

});
export const {  selectCurrenct } = currencySlice.actions;

export default currencySlice.reducer;
