import { createSlice } from "@reduxjs/toolkit";

const addParkomatSlice = createSlice({
  name: "addParkomatSlice",
  initialState: {
    editOrCreate: "",
    formValues: {
      nameOfslotValue: "",
      locationValue:{type:'Point',coordinates:[45.655353,20.654454]} ,
      paymentValue: {namePayment:"",secretKey:"",merchantId:''},
      address:'',
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
      console.log(action.payload)
      state.formValues.nameOfslotValue = action.payload;
    },
    changeLocationValue: (state, action) => {
     
      state.formValues.address = action.payload;
    },
    changeCoordinate: (state, action) => {
      
      state.formValues.locationValue.coordinates= [action.payload.lon,action.payload.lat]
      // state.formValues.locationValue.coordinate = action.payload;
      // state.formValues.locationValue.coordinate.coordinates.coordinates = [action.payload.lon,action.payload.lat];


    },
    changePaymentValue: (state, action) => {
      state.formValues.paymentValue.namePayment = action.payload;
    },
    changePaymentSecretKey:(state,action) => {
      state.formValues.paymentValue.secretKey = action.payload
    },
    changeMerchantId:(state,action) => {
      state.formValues.paymentValue.merchantId=action.payload
    },
    changePicValue: (state, action) => {
      state.formValues.picValue = action.payload;
    },
    changeNotesValue: (state, action) => {
      state.formValues.notesValue = action.payload;
    },
    editingParkomat: (state, action) => {

      state.formValues = {
        nameOfslotValue :action.payload.nameOfslot,
        locationValue : action.payload.location,
        address:action.payload.address,
        paymentValue :{namePayment:action.payload.payment.namePayment,
          secretKey:action.payload.payment.secretKey,merchantId:action.payload.payment.merchantId},
          picValue:action.payload.formPic,
          notesValue:action.payload.notes
      }
  
    },
    setDeleteIco: (state, action) => {
      state.deleteIcon = action.payload;
    },
    clearForm: (state, action) => {
      state.formValues = {
        nameOfslotValue:'',
        locationValue:{ 
          ...state.formValues.locationValue, 
          
        },
        address: '', 
        paymentValue:{namePayment:'',secretKey:'',merchantId:''},
        picValue:null,
        notesValue:'',
      }
    
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
  changePaymentSecretKey,
  changeMerchantId
} = actions;
