import { createSlice } from "@reduxjs/toolkit";

const slotsSlice = createSlice({
  name: "slotsSlice",
  initialState: {
    parkomatArray: null,
    typeOfmodal: "",
  },
  reducers: {
    addParkomats: (state, action) => {
      state.parkomatArray = action.payload;
      console.log(state.parkomatArray);
    },
    addOneMore: (state, action) => {
      state.parkomatArray = [...state.parkomatArray, action.payload];
    },
    deleteParkomat: (state, action) => {
      state.parkomatArray = state.parkomatArray.filter(
        (e, index) => e.uid !== action.payload
      );
    },
    updateParkomat: (state, action) => {
      const { updatedParkomat } = action.payload;
      state.parkomatArray = state.parkomatArray.map((e, i) => {
        if (e.uid == updatedParkomat.uid) {
          return updatedParkomat;
        } else {
          return e;
        }
      });

      
    },
    changeTypeOfModal: (state, action) => {
      state.typeOfmodal = action.payload;
    },
  },
});
const { actions, reducer } = slotsSlice;
export default reducer;
export const {
  addParkomats,
  addOneMore,
  deleteParkomat,
  changeTypeOfModal,
  updateParkomat,
} = actions;
