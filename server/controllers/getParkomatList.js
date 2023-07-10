const { parkomatItem } = require("../models/parkomatItem");
const jwt = require('jsonwebtoken');
const {secret} = require('../config')


const getParkomatList = async (req,res) => {


    try {
        
         const {accessToken } = req.body;
            
      jwt.verify(accessToken, secret,async (err, decoded) => {
        if (err) {
            res.status(403).send({message:err})
          console.error('Error decode  token', err);
        } else {
            const {id} = decoded
           const parkomatList= await parkomatItem.findOne(
            { _id: id }, 
            { parkomatItemsArray: 1 }
           )
          res.send({parkomatList})
           
        }
      })
    } catch (error) {
        console.log(error)
        res.send({message:error})
    }
}


module.exports = getParkomatList