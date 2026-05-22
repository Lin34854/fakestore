import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        updateUserName: (state, action) => {
            if (state.user) {
                state.user.name = action.payload;
            }
        },
        signOut: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setUser, updateUserName, signOut } = authSlice.actions;

export default authSlice.reducer;