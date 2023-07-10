import { createSlice } from "@reduxjs/toolkit";

const addParkomatSlice = createSlice({
  name: "addParkomatSlice",
  initialState: {
    editOrCreate: "",
    formValues: {
      nameOfslotValue: "",
      locationValue: { address: "", coordinate: { lat: "", lon: "" } },
      paymentValue: "",
      picValue: "",
      notesValue: "",
    },
    deleteIcon: true,
  },
  reducers: {
    editCreateToggle: (state, action) => {
      state.editOrCreate = action.payload;
    },
    changeNameOfslotValue: (state, action) => {
      state.formValues.nameOfslotValue = action.payload;
    },
    changeLocationValue: (state, action) => {
      state.formValues.locationValue.address = action.payload;
    },
    changeCoordinate: (state, action) => {
      state.formValues.locationValue.coordinate = action.payload;
      console.log(state.formValues.locationValue.coordinate);
    },
    changePaymentValue: (state, action) => {
      state.formValues.paymentValue = action.payload;
    },
    changePicValue: (state, action) => {
      state.formValues.picValue = action.payload;
    },
    changeNotesValue: (state, action) => {
      state.formValues.notesValue = action.payload;
    },
    editingParkomat: (state, action) => {
      state.formValues.nameOfslotValue = action.payload.nameOfslot;
      state.formValues.locationValue = action.payload.location;
      state.formValues.paymentValue = action.payload.payment;
      state.formValues.picValue = action.payload.formPic;
      state.formValues.notesValue = action.payload.notes;
    },
    setDeleteIco: (state, action) => {
      state.deleteIcon = action.payload;
    },
    clearForm: (state, action) => {
      state.formValues.nameOfslotValue = "";
      state.formValues.locationValue.address = "";
      state.formValues.paymentValue = "google pay";
      state.formValues.picValue = null;
      state.formValues.notesValue = "";
    },
  },
});
const { actions, reducer } = addParkomatSlice;
export default reducer;
export const {
  editCreateToggle,
  changeNameOfslotValue,
  changeLocationValue,
  changePaymentValue,
  changePicValue,
  changeNotesValue,
  editingParkomat,
  setDeleteIco,
  clearForm,
  changeCoordinate,
} = actions;
