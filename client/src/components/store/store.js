import { configureStore } from "@reduxjs/toolkit";
import slotItemSlice from "../SlotItem/slotItemSlice";
import addParkomatSlice from "../AddParkomat/addParkomatSlice";
import slotsSlice from "../Slots/slotsSlice";
import mainSlice from "../Pages/main/mainSlice";
import loginSlice from "../Pages/login/loginSlice";
const store = configureStore({
  reducer: {
    slotItemSlice,
    addParkomatSlice,
    slotsSlice,
    mainSlice,
    loginSlice,
  },

  devTools: process.env.NODE_ENV !== "production",
});

export default store;
