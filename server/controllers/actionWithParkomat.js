const { parkomatItem } = require("../models/parkomatItem");
const jwt = require('jsonwebtoken');
const {secret} = require('../config')
class actionWithParkomat {
   addParkomat = async (req, res) => {
    try {
      const { nameOfslot, location, payment,formPic, notes,uniqueId, accessToken } =
        req.body;
           
        jwt.verify(accessToken, secret,async (err, decoded) => {
          if (err) {
              res.status(403).send({message:err})
            console.error('Error decode  token', err);
          } else {
              
             
              const {id} = decoded
              await parkomatItem.updateOne(
                  { _id: id },
                  {
                    $push: {
                      parkomatItemsArray: {nameOfslot,
                          location,
                          payment,
                          formPic,
                          notes,
                          uid:uniqueId,
                        }
                    },
                  }
                );
               const lastOfParkomatList =  await parkomatItem.findOne(
                  { _id: id }, 
                  { parkomatItemsArray: { $slice: -1 } } 
                )
                if (lastOfParkomatList && lastOfParkomatList.parkomatItemsArray && lastOfParkomatList.parkomatItemsArray.length > 0){
                  const lastObject = lastOfParkomatList.parkomatItemsArray[0];
                  
                
                 
                  res.send({lastObject})
                }
  
           
                
           
          }
        });
      
    } catch (error) {
      res.json(`error ${error}`)
    }
  };

  updateParkomat = (req,res) => {
    try {
      const { formValues:{nameOfslotValue,locationValue,paymentValue,picValue,notesValue},
       accessToken,indexOfParkomat } =
      req.body;
         console.log(indexOfParkomat)
      jwt.verify(accessToken, secret,async (err, decoded) => {
        if (err) {
          res.status(403).send({message:err})
          console.error('Error decode  token', err);
        } else {
            
    

         
            const {id} = decoded
            const document = await parkomatItem.findOneAndUpdate(
              { "parkomatItemsArray.uid": indexOfParkomat },
              { $set: { [`parkomatItemsArray.$`]: {
                nameOfslot:nameOfslotValue,
                location:locationValue,
                payment:paymentValue,
                formPic:picValue,
                notes:notesValue,
                uid:indexOfParkomat

              } } },
              { new: true }
            );
            if (document) {
               const updatedParkomat = document.parkomatItemsArray.find(item => item.uid === indexOfParkomat)
              
              console.log(updatedParkomat)
              res.send({updatedParkomat})
            }
            
            
          
          }


          
          })
    } catch (error) {
      res.send({error})
      console.log(error)
    }
  }
}


module.exports =new actionWithParkomat();
