const mongoose = require("mongoose");
const { Schema } = mongoose;



const coordinateSchema = new mongoose.Schema({
  lat: {
    type: String,
    required: true,
  },
  lon: {
    type: String,
    required: true,
  },
},{ _id: false } );

const locationSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  coordinate: {
    type: coordinateSchema,
    required: true,
  },
},{ _id: false } );

const paymentSchema = new mongoose.Schema({
  namePayment: {
    type: String,
    required: true,
  },
  secretKey: {
    type: String,
    
  },
  merchantId:{
    type:String,
  },
},{ _id: false } );

const parkomatItemSchema = new mongoose.Schema({
  nameOfslot: {
    type: String,
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  payment: {
    type: paymentSchema,
    required:true,
    
  },
  formPic:{
    type:String,
  },
  notes: {
    type: String,
  },
  uid:{
    type:String,
    required:true,
  }
},{ _id: false } );

const parkomatSchema = new mongoose.Schema({
  userId:{ type: String, required: true, unique: true },
  parkomatItemsArray: {
    type: [parkomatItemSchema],
    required: true,
  },
});

const Parkomat = mongoose.model('parkomatItems', parkomatSchema,'parkomatItems');







module.exports = {
    
     Parkomat    

}