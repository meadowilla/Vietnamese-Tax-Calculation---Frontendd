import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthLoading: true,
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuthLoading = false;
            localStorage.setItem('user', JSON.stringify(action.payload)); // Store user data in localStorage
        },
        logout: (state) => {
            state.user = null;
            state.isAuthLoading = false;
            localStorage.removeItem('user'); // Clear user data from localStorage
        },
    },
});
export const {login, logout} = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectIsAuthLoading = (state) => state.user.isAuthLoading;

export default userSlice.reducer;