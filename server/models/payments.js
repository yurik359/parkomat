const mongoose = require("mongoose");
const { Schema } = mongoose;


const Payments = new Schema({
    userId:{type:String,required:true},
    
        fondy:{
            merchantId:String,
            secretKey:String,
        },
    
})
const currentDate = new Date(); // Поточна дата і час за UTC
const localDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000);
const ApprovedPaymentInfo = new Schema({
    order_id:{type:String,required:true},
    userId:{type:String,required:true},
    parkomatId:{type:String,required:true},
    merchant_id:{type:String,required:true},
    sender_email:{type:String,required:true},
    currency:{type:String,required:true},
    amount:{type:String,required:true},
    order_time:{type:String,required:true}, 
    order_status:{type:String,required:true},
    createdAt:{type:Date,default:localDate,required:true}
})

module.exports = {
    Payments:mongoose.model("payments", Payments, "payments"),
    ApprovedPaymentInfo:mongoose.model('ApprovedPaymentInfo',ApprovedPaymentInfo,'ApprovedPaymentInfo')
}