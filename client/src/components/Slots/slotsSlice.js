import { createSlice } from "@reduxjs/toolkit";

const slotsSlice = createSlice({
  name: "slotsSlice",
  initialState: {
    parkomatArray: [],
    typeOfmodal: "",
    paymentsInfo:[],
  },
  reducers: {
    addParkomats: (state, action) => {
    
      state.parkomatArray = action.payload;
      
    },
    addOneMore: (state, action) => {
     
      state.parkomatArray = [...state.parkomatArray, action.payload];
    },
    deleteParkomat: (state, action) => {
      state.parkomatArray = state.parkomatArray.filter(
        (e, index) => e._id !== action.payload
      );
    },
    updateParkomat: (state, action) => {
      console.log(action.payload)
      const { updatedParkomat } = action.payload;
      state.parkomatArray = state.parkomatArray.map((e, i) => {
        if (e._id == updatedParkomat._id) {
          return updatedParkomat
        } else {
          return e;
        }
      });

      
    },
    changeTypeOfModal: (state, action) => {
      state.typeOfmodal = action.payload;
    },
    changePaymentsInfo:(state,action)=> {
      state.paymentsInfo = action.payload
    }
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
  changePaymentsInfo,
} = actions;
