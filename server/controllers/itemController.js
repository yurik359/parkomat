const { parkomatItem } = require("../models/parkomatItem");
const { Parkomat, parkomatSchema } = require("../models/parkomatItem");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const uniqid = require("uniqid");
const CryptoJS = require("crypto-js");
const geolib = require("geolib");

const axios = require("axios");
module.exports = {
  addParkomat: async (req, res) => {
    try {
      const { formValues } = req.body;

      const { id } = req.decoded;
      const newParkomat = await Parkomat.create({
        userId: id,

        nameOfslot: formValues.nameOfslotValue,
        location: formValues.locationValue,
        address: formValues.address,
        payment: formValues.paymentValue,
        formPic: formValues.picValue,
        notes: formValues.notesValue,
      });

      if (newParkomat) {
        res.send(newParkomat);
      }
    } catch (error) {
      console.log(error);
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
          address,
          notesValue,
        },

        indexOfParkomat,
      } = req.body;

      const { id } = req.decoded;

      const updatedParkomat = await Parkomat.findOneAndUpdate(
        { _id: indexOfParkomat },
        {
          nameOfslot: nameOfslotValue,
          location: locationValue,
          payment: paymentValue,
          address,
          formPic: picValue,
          notes: notesValue,
        },
        { new: true }
      );
      if (updatedParkomat) {
        res.send(updatedParkomat);
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

      await Parkomat.deleteOne({ _id: indexOfParkomat });

      res.status(200).send({ status: "deleted" });
    } catch (error) {
      console.log(error);
    }
  },
  getAddresses: async (req, res) => {
    try {
      // const {address} = req.body
      const address = req.query.address;

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          `${address}`
        )}&key=AIzaSyB1Odbx682gqH7bH9t74j9zH9hFeZKxoZQ`
      );

      res.send(response.data);
    } catch (error) {}
  },
  getPlaceId: async (req, res) => {
    const placeId = req.params.placeId;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyB1Odbx682gqH7bH9t74j9zH9hFeZKxoZQ`;
    axios
      .get(url)
      .then((response) => {
        const placeData = response.data;

        res.send(placeData);
      })
      .catch((error) => {
        console.error(error);
      });
  },
  sendPaymentURL: async (req, res) => {
    try {
      const parkomatId = req.params.parkomatId;

      const uniqueId = uniqid();
      const desireItem=await Parkomat.find({ _id:  parkomatId});
    
        const paymentValue = desireItem[0] ? desireItem[0].payment : null;
        

   
         
          const secretKey = "C6JeFM5PbeRbOzI6IlHa0vVYNuYVQj01";
          const requestData = {
            request: {
              response_url: `https://api.pay-parking.net/thank?parkomatId=${parkomatId}`,
              order_id: uniqueId,
              order_desc: "test order",
              currency: "USD",
              amount: "125",
              merchant_id: "1534515",
            },

          };
          const sortedKeys = Object.keys(requestData.request).sort();
          const dataString = [
            secretKey,
            ...sortedKeys.map((key) => requestData.request[key]),
          ].join("|");
          const signature = CryptoJS.SHA1(dataString).toString();
          requestData.request.signature = signature;
          axios
            .post("https://pay.fondy.eu/api/checkout/url/", requestData)
            .then((response) =>{
              console.log(response.data)
              res.send(response.data)
            } )
            .catch((err) => {
              console.log(err), res.send(err);
            });
        
      
    } catch (error) {
      console.log(error);
    }
  },
  getAllParkomats: async (req, res) => {
    
    try {
      const allDocuments = await Parkomat.find({}).select('_id address location');
     
      if (allDocuments&&allDocuments.length>=1) {
        res.send(allDocuments)
      }
      
    } catch (error) {
      console.error("Error:", error);
      res.send(error);
    }
  },
  getAroundParkomats: async (req, res) => {
    try {
      
      const queryParam = req.query;
      let result=null
if(queryParam.parkomatId!=='null'&&queryParam.parkomatId.length==24) {

 result= await Parkomat.findById(queryParam.parkomatId)

}
 


      


      const maxDistance = 500;
      const parkomatQuery = {
        "location.coordinates": {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [queryParam.lon, queryParam.lat],
            },
            $maxDistance: maxDistance,
          },
        },
      };

      Parkomat.find(parkomatQuery)
        .exec()
        .then((nearbyParkomats) => {
        
          
          if (result) {
            console.log(nearbyParkomats,result._id)
            const exists = nearbyParkomats.some((item) => item._id.toString()===result._id.toString());
console.log(exists)
            res.send(exists?nearbyParkomats:[...nearbyParkomats,result])
          } else {
            res.send(nearbyParkomats)
          }
           
        
              
            
          
         

          
        })
        .catch((error) => {
          console.error("Помилка при пошуку ближніх паркоматів:", error);
        });
   
    } catch (error) {
      console.log(error);
    }
  },
  checkParkomat: async (req, res) => {
    try {
      

      
      const parkomatId = req.params.parkomatId;
     
   if(parkomatId.length!==24&&parkomatId !== "null"){
    return res.send({ broken: true, message: "parkomat doesn`t work" });
   }
      const checkParkomat =await Parkomat.find({ _id:  parkomatId});
      
      if (!checkParkomat||checkParkomat.length<1 ) {
   
        res.send({ broken: true, message: "parkomat doesn`t work" });
      } else {
        res.send({ broken: false });
      }
    } catch (error) {
      console.log(error)
      
    }
  },
};
