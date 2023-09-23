const mongoose = require("mongoose");
const { Schema } = mongoose;


const Payments = new Schema({
    userId:{type:String,required:true},
    
        fondy:{
            merchantId:String,
            secretKey:String,
        },
    
})


module.exports = {
    Payments:mongoose.model("payments", Payments, "payments"),
}