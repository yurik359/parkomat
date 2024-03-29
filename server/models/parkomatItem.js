const mongoose = require("mongoose");
const { Schema } = mongoose;



// const coordinateSchema = new mongoose.Schema({
//   lat: {
//     type: String,
//     required: true,
//   },
//   lon: {
//     type: String,
//     required: true,
//   },
  
// },{ _id: false } );

const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    index: "2dsphere"
  }
});

// const locationSchema = new mongoose.Schema({
//   address: { 
//     type: String,
//     required: true,
//   },
//   coordinate: {
//     type: coordinateSchema,
//     required: true,
//   },
//   coordinates: {
//     type: {
//       type: String,
//       enum: ['Point'], // Тип 'Point' для геозапитів
//     },
//     coordinates: {
//       type: [Number], // Масив координат [довгота, широта]
//       required: true,
     
//     },
//   },
// },{ _id: false } );

const paymentSchema = new mongoose.Schema({
  namePayment: {
    type: String,
    required: true,
  },

},{ _id: false } );

// const parkomatItemSchema = new mongoose.Schema({
//   nameOfslot: {
//     type: String,
//     required: true,
//   },
//   location: {
//     type: GeoSchema,
//     required: true,
//   },
//   payment: {
//     type: paymentSchema,
//     required:true,
    
//   },
//   formPic:{
//     type:String,
//   },
//   notes: {
//     type: String,
//   },
//   uid:{
//     type:String,
//     required:true,
//   }
// },{ _id: false } );

const parkomatSchema = new mongoose.Schema({
  userId:{ type: String, required: true,},
  // parkomatItemsArray: {
  //   type: [parkomatItemSchema],
  //   required: true,
  // },,
  nameOfslot: {
    type: String,
    required: true,
  },
  address: { 
    type: String,
    required: true,
  },
  isSupportedByCarNumber:{
    type: Boolean,
    required:true
  },
  location: {
    type: GeoSchema,
    required: true,
  },
  endpoint:{type:String},
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
  isDebtor: {
    type:Boolean,
    
  }
 
});

const Parkomat = mongoose.model('parkomatItems', parkomatSchema,'parkomatItems');







module.exports = {
    
     Parkomat    

}