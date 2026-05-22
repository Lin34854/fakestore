import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        },

        toggleOrder: (state, action) => {
            const order = state.orders.find(o => o.id === action.payload);
            if (order) {
                order.expanded = !order.expanded;
            }
        },

        clearOrders: (state) => {
            state.orders = [];
        },
    },
});

export const {
    setOrders,
    toggleOrder,
    clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;