const mongoose = require("mongoose");
const { Schema } = mongoose;


const User = new Schema({
    organizationName:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,unique:true,required:true},
    secretKey_TwoFa:{type:String},
    recToken:{type:String},
    phone:{type:String,unique:true,required:true}
})
const Debtor = new Schema({
    userId:{type:String,required:true},
    debt:{type:String,required:true},
    currency:{type:String},
    isDisabled:{type:Boolean,default:false}
},{timestamps:true}) 

module.exports = {
    User:mongoose.model("users", User, "users"),
    Debtor:mongoose.model("Debtors", Debtor, "Debtors")
}

