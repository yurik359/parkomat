const { User } = require("../models/user");
const { Payments } = require("../models/payments");

module.exports = {
  savePaymentInfo: async (req, res) => {
    try {
      const { id } = req.decoded;
      const request = req.body;

      if (request.type === "fondy") {
       
        const { merchantId, secretKey } = request;
       const res= await Payments.updateOne(
            { userId: id },
            {
              $set: {
                'fondy.merchantId': merchantId,
                'fondy.secretKey': secretKey
              }
            },
            { upsert: true }
          );
        
      }

      res.status(200).send({ message: "data saved" });
    } catch (error) {
      console.log(error);
    }
  },
  getPaymentsSystems:async(req,res) => {
    try {
        const { id } = req.decoded;
      
        const result = await Payments.find({userId:id})
      
if(result.length>0){
    res.send(result[0])
}else {res.send([])}
        
    } catch (error) {
        console.log(error)
        
    }
  }
};
