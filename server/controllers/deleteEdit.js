const { parkomatItem } = require("../models/parkomatItem");
const jwt = require('jsonwebtoken');
const {secret} = require('../config')



class deleteEdit {
     deleteParkomat = async (req,res)=> {
        try {
            const {indexOfParkomat,accessToken} =  req.body
            jwt.verify(accessToken, secret,async (err, decoded) => {
                if (err) {
                    res.status(403).send({message:err})
                  console.error('Error decode  token', err);
                } else {
                    const {id} = decoded
                    
                  await parkomatItem.updateOne(
                    { _id: id },
                    { $pull: { parkomatItemsArray: { uid: indexOfParkomat } } }
                  )

                    

                    res.status(200).send({status:'deleted'})
                }
            
            })


        } catch (error) {
            console.log(error)
        }
            
    }
}


module.exports = new deleteEdit();


