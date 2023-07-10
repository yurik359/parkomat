import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
  name: "mainSlice",
  initialState: {
    accessToken: "",
  },
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
  },
});
const { actions, reducer } = mainSlice;
export default reducer;
export const { setAccessToken } = actions;
