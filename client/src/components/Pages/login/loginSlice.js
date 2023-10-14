import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: {
    forgotPassword: false,
    twoFaModal:false,
  },
  reducers: {
    setForgotPassword: (state, action) => {
      state.forgotPassword = action.payload;
    },
    setTwoFaModal:(state,action) => {
      state.twoFaModal = action.payload
    }
  },
  
});
const { actions, reducer } = loginSlice;
export default reducer;
export const { setForgotPassword ,setTwoFaModal} = actions;
