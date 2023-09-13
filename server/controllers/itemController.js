const { parkomatItem } = require("../models/parkomatItem");
const { Parkomat,parkomatSchema } = require("../models/parkomatItem");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const uniqid = require('uniqid');
const CryptoJS = require('crypto-js');
const geolib = require('geolib');

const axios = require('axios');
module.exports = {
  addParkomat: async (req, res) => {

    try {
       const {formValues,uniqueId} = req.body
       console.log(formValues.locationValue)
      // const {
      //   nameOfslot,
      //   location,
      //   payment,
      //   formPic,
      //   notes,
      //   uniqueId,
      //   accessToken,
      // } = req.body;
      

      const { id } = req.decoded;

      await Parkomat.findOneAndUpdate(
        { ["userId"]: id },
        {
          $push: {
            parkomatItemsArray: {
              nameOfslot:formValues.nameOfslotValue,
              location:formValues.locationValue,
              payment:formValues.paymentValue,
              formPic:formValues.picValue,
              notes:formValues.notesValue,
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
    
      
      const placeId = req.params.placeId; 
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyB1Odbx682gqH7bH9t74j9zH9hFeZKxoZQ`;
      axios.get(url)
      .then(response => {
        const placeData = response.data;
    
        res.send(placeData)
        
      })
      .catch(error => {
        console.error(error);
      });
  
  } ,
  sendPaymentURL :async (req,res) => {
    try {
      const parkomatId = req.params.parkomatId;
      
      const uniqueId = uniqid();
     const document= await Parkomat.findOne(
        { "parkomatItemsArray.uid": parkomatId },
      )
      if(document&&document.parkomatItemsArray) {
        
        const desiredObject = document.parkomatItemsArray.find(item => item.uid === parkomatId);
        const paymentValue = desiredObject ? desiredObject.payment : null;
   
        if(paymentValue&&paymentValue.secretKey&&paymentValue.merchantId){
          const secretKey ='test'; 
          const requestData = {
            request:{
              response_url:`https://api.pay-parking.net/thank?parkomatId=${parkomatId}`,
              order_id: uniqueId,
              order_desc: 'test order',
              currency: 'USD',
              amount: '125',
              merchant_id: '1396424'
            }
            };
            const sortedKeys = Object.keys(requestData.request).sort();
            const dataString = [secretKey, ...sortedKeys.map(key => requestData.request[key])].join('|');
            const signature = CryptoJS.SHA1(dataString).toString();
            requestData.request.signature=signature
          axios.post('https://pay.fondy.eu/api/checkout/url/', requestData)
          .then(response=>res.send(response.data))
          .catch(err=>{
            console.log(err),
            res.send(err)}
          )
        }
    
      }
    
    } catch (error) {
      console.log(error)
    }
  },
  getAllParkomats:async (req,res) => {
    try {
      
       
      
       
      const documents = await Parkomat.find({ parkomatItemsArray: { $exists: true, $not: { $size: 0 } } });
      
    
      let allParkomatItems = [];
  
     
      documents.forEach(doc => {
        allParkomatItems = allParkomatItems.concat(doc.parkomatItemsArray);
      });
      if(allParkomatItems.length>1) {
       const allParkomatLocation= allParkomatItems.map(e=>{
          return {
          location:e.location
          }

        })
        res.send({allParkomatLocation})
       
        
      }
  
    
      
    } catch (error) {
      console.error('Error:', error);
      res.send(error)
    }
  },
  getAroundParkomats:async (req,res)=>{
try {
  // Parkomat.createIndex({ 'location.coordinate': '2dsphere' })
  const coordinates = req.query
  
  const documents = await Parkomat.find({ parkomatItemsArray: { $exists: true, $not: { $size: 0 } } });
      
    
      let allParkomatItems = [];
  
     
      documents.forEach(doc => {
        allParkomatItems = allParkomatItems.concat(doc.parkomatItemsArray);
      });

      if(allParkomatItems.length>1) {
        const filteredItems=  allParkomatItems.filter(({location:{coordinate:{lat,lon}}})=>{

          const distance = geolib.getDistance({latitude:coordinates.lat,longitude:coordinates.lon}, {latitude:lat,longitude:lon});
          return distance < 300;
        
        }).map(e=>{
          return {
            location:e.location
          }
        })
        
        res.send(filteredItems)
      }


  // const maxDistance = 300
  // const parkomatQuery = {
  //   'parkomatItemsArray.location.coordinates.coordinates': {
  //     $near: {
  //       $geometry: {
  //         type: 'Point',
  //         coordinates: [25.1580826,49.4305736 ],
  //         distanceField: 'distance', 
  //       },
  //       $maxDistance: maxDistance,
  //     },

  //   },

  // };

  // Parkomat.find(parkomatQuery)
  // .exec()
  // .then((nearbyParkomats) => {

  //   console.log('Ближні паркомати:', nearbyParkomats);
  // })
  // .catch((error) => {
  //   console.error('Помилка при пошуку ближніх паркоматів:', error);
  // });
  // await Parkomat.collection.createIndex({ 'location.coordinate': '2dsphere' });
  // const parkomat = await Parkomat.findById('64e3907a9404d9a890ab185a');

  //   if (!parkomat) {
  //     console.log('Паркомат не знайдено.');
  //     return;
  //   }

  //   const hasGeoIndex = parkomat.schema.indexes().some((index) => {
  //     return index[0]['location.coordinate'] === '2dsphere';
  //   });

  //   if (hasGeoIndex) {
  //     console.log('У паркомата є гео-індекс.');
  //   } else {
  //     console.log('У паркомата немає гео-індексу.');
  //   }
  
  // Parkomat.aggregate([
  //   {
  //     $unwind: '$parkomatItemsArray',
  //   },
  //   {
  //     $match: {
  //       'parkomatItemsArray.location.coordinate': {
  //         $nearSphere: {
  //           $geometry: {
  //             type: 'Point',
  //             coordinates: [25.594767, 49.553517], // Ваші координати
  //           },
  //           $maxDistance: 300, // Максимальна відстань в метрах
  //         },
  //       },
  //     },
  //   },
  // ]) .then((nearbyParkomats) => {
  //       // Результат містить паркомати, що знаходяться в радіусі 300 метрів від користуача
  //       console.log('Ближні паркомати:', nearbyParkomats);
  //     })
  //     .catch((error) => {
  //       console.error('Помилка при пошуку ближніх паркоматів:', error);
  //     });
  
 
  // Parkomat.aggregate([
  //   {
  //     $geoNear: {
  //       near: {
  //         type: 'Point',
  //         coordinates: [25.594767, 49.553517], // Важливо: координати у форматі [lon, lat]
  //       },
  //       distanceField: 'distance', // Поле для збереження відстані
  //       maxDistance: 300, // Максимальна допустима відстань
  //       spherical: true, // Географічний пошук
  //     },
  //   },
  // ])
  //   .then((nearbyParkomats) => {
  //     // Результат містить паркомати, що знаходяться в радіусі 300 метрів від користуача
  //     console.log('Ближні паркомати:', nearbyParkomats);
  //   })
  //   .catch((error) => {
  //     console.error('Помилка при пошуку ближніх паркоматів:', error);
  //   });


} catch (error) {
  console.log(error)
}
  },
  checkParkomat:async (req,res)=>{
    try {
      const parkomatId = req.params.parkomatId;
      console.log(parkomatId)
      const checkParkomat  = await Parkomat.findOne({
        'parkomatItemsArray.uid': parkomatId
      });
      if(!checkParkomat&&parkomatId!=='null') {
           console.log('doesnt')
        res.send({broken:true,message:'parkomat doesn`t work'})
      } else {
     
        res.send({broken:false})
      }
    } catch (error) {
      
    }
   
  }
  
};

