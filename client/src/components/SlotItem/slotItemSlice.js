import { createSlice } from "@reduxjs/toolkit";

const slotItemSlice = createSlice({
  name: "slotItemSlice",
  initialState: {
    indexOfParkomat: null,
    selectedParkomat: false,
    clickedParkomat: false,
  },
  reducers: {
    addIndexParkomat: (state, action) => {
      console.log(action.payload);
      state.indexOfParkomat = action.payload;
    },
    toggleSelectParkomat: (state, action) => {
      state.selectedParkomat = action.payload;
    },
    changeClickedParkomat: (state, action) => {
      state.clickedParkomat = action.payload;
    },
  },
});
const { actions, reducer } = slotItemSlice;
export default reducer;
export const { addIndexParkomat, changeClickedParkomat } = actions;
