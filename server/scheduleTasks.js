const schedule = require("node-schedule");
const {
  Payments,
  ApprovedPaymentInfo,
  paymentsOurClients,
} = require("./models/payments");
const { Debtor,User } = require("./models/user");
const { Parkomat } = require("./models/parkomatItem");
const uniqid = require("uniqid");
const axios = require("axios");
const CryptoJS = require("crypto-js");
const checkPayment = async () => {
  const job = schedule.scheduleJob("0 23 * * 1", async function () {
    const res = await ApprovedPaymentInfo.aggregate([
        {
          $group: {
            _id: "$userId",
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "paymentsOurClients",
            localField: "_id",
            foreignField: "userId",
            as: "secondCollectionData",
          },
        },
        {
          $project: {
            _id: 0,
            userId: "$_id",
            count: { $ifNull: ["$count", 0] },
            totalSum: { $sum: "$secondCollectionData.amount" },
          },
        },
        {
          $project: {
            userId: 1,
            count: 1,
            totalSum: { $ifNull: ["$totalSum", 0] },
            result: {
              $subtract: [
                { $multiply: ["$count", 0.013] },
                { $divide: ["$totalSum", 100] },
              ],
            },
          },
        },
        {
          $match: {
            result: { $gt: 0.1 },
          },
        },
      ]);
      if (res && res.length >= 1) {
        res.forEach(async (item) => {
          try {
            const newItem = await Debtor.findOneAndUpdate(
              { userId: item.userId },
              { userId: item.userId, debt: item.result, currency: "USD" },
    
              {
                new: true,
                upsert: true,
                useFindAndModify: false,
              }
            );
          } catch (error) {
            console.error("Помилка збереження:", error);
          }
        });
      }
    console.log("Функція виконується о 23:00");
  });
  

  // кожен день перевірка чи не більше ніж 30 днів чувак вже не платить.
  schedule.scheduleJob("0 3 * * *", async function () {

 const thirtyOneDaysAgo = new Date();
 thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
 const thirtyTwoDaysAgo = new Date();
 thirtyTwoDaysAgo.setDate(thirtyTwoDaysAgo.getDate() - 32);

 const debtorsMore30Days = await Debtor.aggregate([
   {
     $match: {
       createdAt: { $lte: thirtyOneDaysAgo, $gt: thirtyTwoDaysAgo },
       isDisabled: false,
     },
   },
 ]);

 if (debtorsMore30Days && debtorsMore30Days.length >= 1) {
   debtorsMore30Days.forEach(async (item) => {
     await Parkomat.updateMany(
       { userId: item.userId },
       { $set: { isDebtor: true } }
     );
     await Debtor.findOneAndUpdate(
       { userId: item.userId },
       { isDisabled: true }
     );
   });
 }

 console.log(debtorsMore30Days);
  });


// графік в понеділок в першій ночі
  schedule.scheduleJob("0 1 * * 1", async function () {

const usersWithToken=  await User.find({ recToken: { $exists: true } })
if(usersWithToken&&usersWithToken.length>=1) {
   usersWithToken.forEach(async(item)=> {
       const resu = await paymentsOurClients.aggregate([
           {
             $match: {
               userId: item._id, // Умова для першого поля
               order_status: "approved", // Умова для другого поля
             },
           },
           {
             $group: {
               _id: null, // Групуємо всі документи разом
               totalSum: { $sum: { $toInt: "$amount" } }, // Підрахунок суми по полю "fieldToSum"
             },
           },
         ]);
           const allUserTransaction = await ApprovedPaymentInfo.countDocuments({
   userId: item._id,
   order_status: "approved",
 });

 const userPaidForAllTime = resu.length >= 1 ? resu.totalSum : 0;
 const userDebt = (allUserTransaction*0.013) - (userPaidForAllTime/100)
 if(userDebt<0.1) return
 const fondyAmount = userDebt*100
 const uniqueId = uniqid();
 const secretKey = "C6JeFM5PbeRbOzI6IlHa0vVYNuYVQj01";
 const requestData = {
   request: {
   
     server_callback_url:`https://api.pay-parking.net/handlerClientPayment`,
     order_id: uniqueId,
     order_desc: "test order",
     currency: "USD",
   amount: fondyAmount.toString(),
   merchant_id: "1534515",
   merchant_data:item._id,
   rectoken:item.recToken,
   
   },
 };
 const sortedKeys = Object.keys(requestData.request).sort();
         const dataString = [
           secretKey,
           ...sortedKeys.map((key) => requestData.request[key]),
         ].join("|");
         const signature = CryptoJS.SHA1(dataString).toString();
         requestData.request.signature = signature;
         setTimeout(()=>{
           axios
           .post("https://pay.fondy.eu/api/recurring", requestData)
           .then((response) =>{
            if(response.data.response.response_status==='success'){

            }
            console.log(response.data)
           } )
           .catch((err) => {
             console.log(err)
           });
         },2000)
        

   })
}
console.log(usersWithToken)
  })


  


};

module.exports = {
  checkPayment,
};
