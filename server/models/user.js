const mongoose = require("mongoose");
const { Schema } = mongoose;


const User = new Schema({
    organizationName:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    email:{type:String,unique:true,required:true}
})


module.exports = {
    User:mongoose.model("users", User, "users"),
}