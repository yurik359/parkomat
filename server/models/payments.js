const mongoose = require("mongoose");
const { Schema } = mongoose;


const Payments = new Schema({
    userId:{type:String,required:true},
    paymentSystem:{type:String,required:true},
    paymentApiKey:{type:String,required:true},
    secretKey:{type:String,required:true}
       
    
})
const currentDate = new Date(); // Поточна дата і час за UTC
const localDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000);
const ApprovedPaymentInfo = new Schema({
    paymentSystem:{type:String,required:true},
    order_id:{type:String,required:true},
    userId:{type:String,required:true},
    parkomatId:{type:String,required:true},
    merchant_id:{type:String},
    sender_email:{type:String,required:true},
    currency:{type:String,required:true},
    amount:{type:String,required:true},
    order_time:{type:String}, 
    order_status:{type:String,required:true},
    createdAt:{type:Date,default:localDate,required:true}
})
const paymentsOurClients = new Schema({
    order_id:{type:String,required:true},
    userId:{type:String,required:true},
   
    merchant_id:{type:String,required:true},
    sender_email:{type:String,required:true},
    currency:{type:String,required:true},
    amount:{type:Number,required:true},
    order_time:{type:String,required:true}, 
    order_status:{type:String,required:true},
    createdAt:{type:Date,default:localDate,required:true}
})

const endpointInfo = new Schema({
    endpoint:{type:String, required:true},
    userId:{type:String,required:true},
    contentType:{type:String,required:true},
    autherizationMethodContent:{type:String,required:true},
    autherizationMethod:{type:String,required:true},
    method:{type:String, required:true},
    period:{type:String, required:true},
    amount:{type:String, required:true},
    currency:{type:String, required:true}

})
module.exports = {
    Payments:mongoose.model("payments", Payments, "payments"),
    ApprovedPaymentInfo:mongoose.model('ApprovedPaymentInfo',ApprovedPaymentInfo,'ApprovedPaymentInfo'),
    paymentsOurClients:mongoose.model('paymentsOurClients',paymentsOurClients,'paymentsOurClients'),
    EndpointInfo:mongoose.model('EndpointInfo',endpointInfo,'EndpointInfo')
}