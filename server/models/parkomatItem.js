const mongoose = require("mongoose");
const { Schema } = mongoose;

const parkomatItem = new Schema({
    _id:{ type: String, required: true, unique: true },
    parkomatItemsArray:{type:Array},  
    // nameOfslot:{ type: String, required: true, },
    //   location:{ type: String, required: true, },
    //   payment:{ type: String, required: true, },
    //   uploadPic: {
    //     name: String,       
    //     contentType: String,    
    //     data: Buffer  
    //   },
    //   notes:{ type: String, required: true, }
})


module.exports = {
    parkomatItem: mongoose.model("parkomatItems", parkomatItem,"parkomatItems"),
}