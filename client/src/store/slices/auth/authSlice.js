import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: JSON.parse(localStorage.getItem("authStatus")) || false,
    userData: JSON.parse(localStorage.getItem("userData")) || null,
    primaryPath: 'store',
    token: localStorage.getItem("authToken") || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
            state.token = action.payload.token;

            // Save to localStorage
            localStorage.setItem("authStatus", JSON.stringify(true));
            localStorage.setItem("userData", JSON.stringify(action.payload.userData));
            localStorage.setItem("authToken", action.payload.token);
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            state.token = null;

            // Clear from localStorage
            localStorage.removeItem("authStatus");
            localStorage.removeItem("userData");
            localStorage.removeItem("authToken");
        },
        setToken: (state, action) => {
            state.token = action.payload;
            localStorage.setItem("authToken", action.payload);
        },
        setCurrentUser: (state, action) => {
            state.userData = action.payload;
            localStorage.setItem("userData", JSON.stringify(action.payload));
        },
        setPrimayPath: (state, action) => {
            state.primaryPath = action.payload;
        },
    },
});

export const { login, logout, setToken, setCurrentUser, setPrimayPath } = authSlice.actions;

export default authSlice.reducer;
