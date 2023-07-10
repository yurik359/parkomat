import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: {
    forgotPassword: false,
  },
  reducers: {
    setForgotPassword: (state, action) => {
      state.forgotPassword = action.payload;
    },
  },
});
const { actions, reducer } = loginSlice;
export default reducer;
export const { setForgotPassword } = actions;
