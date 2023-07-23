const { parkomatItem } = require("../models/parkomatItem");
const { Parkomat } = require("../models/parkomatItem");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const axios = require('axios');
module.exports = {
  addParkomat: async (req, res) => {
    try {
      const {
        nameOfslot,
        location,
        payment,
        formPic,
        notes,
        uniqueId,
        accessToken,
      } = req.body;


      const { id } = req.decoded;

      await Parkomat.findOneAndUpdate(
        { ["userId"]: id },
        {
          $push: {
            parkomatItemsArray: {
              nameOfslot,
              location,
              payment,
              formPic,
              notes,
              uid: uniqueId,
            },
          },
        },
        { upsert: true }
      );

      const lastOfParkomatList = await Parkomat.findOne(
        { ["userId"]: id },
        { parkomatItemsArray: { $slice: -1 } }
      );

      if (
        lastOfParkomatList &&
        lastOfParkomatList.parkomatItemsArray &&
        lastOfParkomatList.parkomatItemsArray.length > 0
      ) {
        const lastObject = lastOfParkomatList.parkomatItemsArray[0];

        res.send({ lastObject });
      }
    } catch (error) {
      res.json(`error ${error}`);
    }
  },
  updateParkomat: async (req, res) => {
    try {
      const {
        formValues: {
          nameOfslotValue,
          locationValue,
          paymentValue,
          picValue,
          notesValue,
        },

        indexOfParkomat,
      } = req.body;
      
      const { id } = req.decoded;

      const document = await Parkomat.findOneAndUpdate(
        { "parkomatItemsArray.uid": indexOfParkomat },
        {
          $set: {
            [`parkomatItemsArray.$`]: {
              nameOfslot: nameOfslotValue,
              location: locationValue,
              payment: paymentValue,
              formPic: picValue,
              notes: notesValue,
              uid: indexOfParkomat,
            },
          },
        },
        { new: true }
      );
      if (document) {
        const updatedParkomat = document.parkomatItemsArray.find(
          (item) => item.uid === indexOfParkomat
        );

        
        res.send({ updatedParkomat });
      }
    } catch (error) {
      res.send({ error });
      console.log(error);
    }
  },
  deleteParkomat: async (req, res) => {
    try {
    
      const { indexOfParkomat, accessToken } = req.query;
 
      const { id } = req.decoded;

      await Parkomat.updateOne(
        { ["userId"]: id },
        { $pull: { parkomatItemsArray: { uid: indexOfParkomat } } }
      );
      res.status(200).send({ status: "deleted" });
    } catch (error) {
      console.log(error);
    }
  },
  getAddresses: async (req,res) => {
    try {
      // const {address} = req.body
      const address = req.query.address;
    
  const response= await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(`${address}`)}&key=AIzaSyB1Odbx682gqH7bH9t74j9zH9hFeZKxoZQ`)
  
      res.send(response.data)

   
  

    } catch (error) {
      
    }

  },
  getPlaceId:async (req,res) => {
    
      console.log(req.params)
      const placeId = req.params.placeId; 
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyB1Odbx682gqH7bH9t74j9zH9hFeZKxoZQ`;
      axios.get(url)
      .then(response => {
        const placeData = response.data;
    
        res.send(placeData)
        // Здесь вы можете обрабатывать полученные данные о месте
      })
      .catch(error => {
        console.error(error);
      });
  
  } 
};
