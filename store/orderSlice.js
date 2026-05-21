import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        createOrder: (state, action) => {
            const newOrder = {
                id: Date.now(),
                items: action.payload.items,
                totalItems: action.payload.totalItems,
                totalPrice: action.payload.totalPrice,
                status: 'new',
                expanded: false,
            };

            state.orders.push(newOrder);
        },

        payOrder: (state, action) => {
            const order = state.orders.find(o => o.id === action.payload);
            if (order) {
                order.status = 'paid';
            }
        },

        receiveOrder: (state, action) => {
            const order = state.orders.find(o => o.id === action.payload);
            if (order) {
                order.status = 'delivered';
            }
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
    createOrder,
    payOrder,
    receiveOrder,
    toggleOrder,
    clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;