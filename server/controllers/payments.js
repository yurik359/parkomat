const { User } = require("../models/user");
const { Payments ,ApprovedPaymentInfo} = require("../models/payments");
const path = require("path");
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
  },
  AppovedPaymentsInfo:async(req,res) => {
    try {
      const paymentInfo = req.body
         await ApprovedPaymentInfo.create({
          order_id:paymentInfo.order_id,
          merchant_id:paymentInfo.merchant_id,
          sender_email:paymentInfo.sender_email,
          currency:paymentInfo.currency,
          amount:paymentInfo.amount,
          order_time:paymentInfo.order_time,
          order_status:paymentInfo.order_status

          

        })
        res.sendFile(path.join(__dirname, '../../client/public/thankYou.html'));

    } catch (error) {
      console.log(error)
    }
  }
};
