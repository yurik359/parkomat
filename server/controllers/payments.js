const { User } = require("../models/user");
const { Payments ,ApprovedPaymentInfo,paymentsOurClients} = require("../models/payments");
const path = require("path");
const stripe = require('stripe');
const { off } = require("process");
module.exports = {
  savePaymentInfo: async (req, res) => {
    try {
      const { id } = req.decoded;
      const request = req.body;

     
       
        const { paymentApiKey, secretKey,type } = request;
       const resu= await Payments.updateOne(
            { userId: id,
              'paymentSystem': type
            },
            {
              $set: {
                'paymentSystem': type,
                'secretKey': secretKey,
                'paymentApiKey':paymentApiKey
              }
            },
            { upsert: true }
          );
        
      

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
  console.log(result)
    res.send(result)
}else {res.send([])}
        
    } catch (error) {
        console.log(error)

    }
  },
  AppovedPaymentsInfo:async(req,res) => {
    try {
      const paymentInfo = req.body
      
      const ifStripe = paymentInfo.paymentSystem&&paymentInfo.paymentSystem==="Stripe"?paymentInfo.paymentSystem:null

     const parkomatId =!ifStripe? req.query.parkomatId : paymentInfo.parkomatId

         await ApprovedPaymentInfo.create({
          paymentSystem:ifStripe?'Stripe':'Fondy',
          userId:ifStripe?paymentInfo.userId:paymentInfo.merchant_data,
          parkomatId,
          order_id:paymentInfo.order_id,
          merchant_id:!ifStripe?paymentInfo.merchant_id:null,
          sender_email:paymentInfo.sender_email,
          currency:paymentInfo.currency,
          amount:paymentInfo.amount,
          order_time:!ifStripe?paymentInfo.order_time:null,
          order_status:paymentInfo.order_status

          
        })
        if(!ifStripe) {
          res.sendFile(path.join(__dirname, '../../client/public/thankYou.html'));
        } else {
          res.send({messages:'Payment saved'})
        }
        

    } catch (error) {
      console.log(error)
    }
  },
  getPaymentStatistic:async (req,res) => {
    try {
      const { id } = req.decoded;
     
     
      
      const totalTransactions = await ApprovedPaymentInfo.countDocuments({userId:id})
      const totalApproved = await ApprovedPaymentInfo.countDocuments({ order_status: 'approved',userId:id })
      const result = await ApprovedPaymentInfo.aggregate([
        {
          $match: {
            "userId": id
          }
        },
        {
          
          
          $group: {
            _id:null,
            totalSum: { $sum: { $toInt: "$amount" } }
          }
        }
      ])
const sumTransactions = result&&result.length>=1?result[0].totalSum:0
res.send({totalTransactions,totalApproved,sumTransactions})
    } catch (error) {
      console.log(error)
    }
  },
  getTimeRange:async (req,res) => {
    try {
      const { id } = req.decoded;
      const dateToFilter = req.body.dateToFilter
     const parkomatIdList = req.body.parkomatIdList
const testo = await ApprovedPaymentInfo.find({userId:id})
console.log(testo)
     const resSumTransactions = await ApprovedPaymentInfo.aggregate([
      {
        $match: {
          "userId": id,
          createdAt: { $gte: new Date(dateToFilter.start), $lte: new Date(dateToFilter.end) }
        }
      },
      {
        
        
        $group: {
          _id:null,
          totalSum: { $sum: { $toInt: "$amount" } },
        
          countApproved: {
            $sum: {
              $cond: [{ $eq: ["$order_status", "approved"] }, 1, 0] // Підрахунок документів з order_status === 'approved'
            }
          }
        }
      }
    ])
    const uniqueOrderIds = await ApprovedPaymentInfo.distinct("order_id", {
      userId: id,
      createdAt: { $gte: new Date(dateToFilter.start), $lte: new Date(dateToFilter.end) }
    });
    const uniqueOrderIdsCount = uniqueOrderIds.length;
  
    const sumTransactions = resSumTransactions&&resSumTransactions.length>=1?resSumTransactions:[]
    const allPaymentsArray = await ApprovedPaymentInfo.aggregate([
      {
        $match: {
          "userId": id,
          createdAt: { $gte: new Date(dateToFilter.start), $lte: new Date(dateToFilter.end) }
        }
      }
      
    ])
   
     if(allPaymentsArray&&allPaymentsArray.length>=1&&sumTransactions&&sumTransactions.length>=1) {
      sumTransactions[0]['allPaymentsArray']=allPaymentsArray
      sumTransactions[0]['allTransaction']=uniqueOrderIdsCount
     }
    

   const test = await ApprovedPaymentInfo.aggregate([
    {
      $match: {
        "userId": id,
        createdAt: { $gte: new Date(dateToFilter.start), $lte: new Date(dateToFilter.end) }
      }
    },

    {
          $project: {
            hour: { $hour: "$createdAt" }, // Отримання години з createdAt
             // Отримання дня тижня з createdAt
            // Тут можна створити ще поля для інших періодів часу
          }
        
    },
    {

        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $and: [{ $gte: ["$hour", 0] }, { $lte: ["$hour", 6] }] }, then: "00-06am" },
                { case: { $and: [{ $gte: ["$hour", 6] }, { $lte: ["$hour", 10] }] }, then: "06-10am" },
                { case: { $and: [{ $gte: ["$hour", 10] }, { $lte: ["$hour", 14] }]  }, then: "10-14pm" },
                { case: { $and: [{ $gte: ["$hour", 14] }, { $lte: ["$hour", 18] }] }, then: "14-18pm" },
                { case: { $and: [{ $gte: ["$hour", 18] }, { $lte: ["$hour", 24] }] }, then: "18-12pm" }

                // Додайте інші діапазони часу за потреби
              ],
              default: "Other"
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ])
  
   
    const result= await ApprovedPaymentInfo.find({
        createdAt: {
          $gte: dateToFilter.start,
          $lte: dateToFilter.end,
        },
      })

      const resultPie =await ApprovedPaymentInfo.aggregate([
        {
          $match: {
            parkomatId: { $in: parkomatIdList},// Фільтрація за певним значенням поля 'parkomatId'
            order_status:"approved"
          }
        },
        
        {
          $match: {
            createdAt: {
              $gte:new Date(dateToFilter.start), // Нижня межа дати
              $lte:new Date(dateToFilter.end), // Верхня межа дати
            }
          }
        },
        {
          $group: {
            _id: "$parkomatId", // Групування за унікальними значеннями поля 'parkomatId'
            count: { $sum: 1 },
             // Підрахунок кількості документів для кожного 'parkomatId'
          }
        },
        {
          $sort: {
            "_id": 1 // Сортування за зростанням для _id (за бажанням)
          }
        }
      ])

       
      res.send({bar:test,pie:resultPie,sumTransactions,allTransaction:uniqueOrderIdsCount})
    } catch (error) {
      console.log(error)
    }
  },
  getForPie : async (req,res) => {
    try {
     
   
    //  const result= ApprovedPaymentInfo.aggregate([
    //     {
    //       $match: {
    //         parkomatId: { $in: ['65212b5dafaf6b416c623910'] } // Фільтрація за декількома значеннями id
    //       }
    //     },
    //     {
    //       $group: {
    //         parkomatId: "$65212b5dafaf6b416c623910", // Групування за унікальними значеннями поля 'id'
    //         count: { $sum: 1 } // Підрахунок кількості документів для кожного 'id'
    //       }
    //     },
    //     {
    //       $sort: { count: -1 } // Сортування за кількістю (за бажанням)
    //     }
    //   ])
      console.log(result)
      res.send(result)
    } catch (error) {
      console.log(error)
    }
  },
  howMuchToPay:async (req,res) => {
    try {
      const { id } = req.decoded;
      console.log(id)
      const resu = await paymentsOurClients.aggregate([
        {
          $match: {
            userId: id, // Умова для першого поля
            order_status: "approved"  // Умова для другого поля
          }
        },
        {
          $group: {
            _id: null, // Групуємо всі документи разом
            totalSum: { $sum:{$toInt:"$amount"}  } // Підрахунок суми по полю "fieldToSum"
          }
        }
      
     
      ]);
      

      const result = await ApprovedPaymentInfo.countDocuments({
        userId: id,
        order_status: "approved" 
      });
      const userPaidForAllTime = resu.length>=1?resu.totalSum/100:0
      console.log(result,userPaidForAllTime)
      
      res.send({userPaidForAllTime,allTransaction:result})
    } catch (error) {
      console.log(error)
    }
  },
  createStripeIntent:async (req,res) => {
    try {
      const { paymentMethod,price,userId } = req.body;
      const stripeInstance = stripe('sk_test_51OQVAVLBGq7IrdLL5pjWGFOFWUImKVoH735fb1tYvoXJgGfaxiG05lM9IDaAucrTV9M0KESwxV5jUoqQo4SvAVzh009XPLiaKl');


      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: price,
        currency: 'usd',
        payment_method_types: ['card'],
        description: 'Описание платежа',
        metadata: {
          customer_email: 'customer@example.com', // Здесь указывается email клиента
        },
      });
      


      // const paymentIntent = await stripeInstance.checkout.sessions.create({
      //   payment_method_types: ['card'],
      //   line_items: [
      //     {
      //       price_data: {
      //         currency: 'usd',
      //         product_data: {
      //           name: 'lolololol',
      //         },
      //         unit_amount: price, // Сумма платежа в минимальных единицах валюты (например, центы)
      //       },
      //       quantity: 1,
      //     },
      //   ],
      //   mode: 'payment',
      //   success_url: 'http://localhost:4001/thankYou?payment_id=123&status=success',
      //   cancel_url: 'https://api.pay-parking.net/thank?',
      // });
      console.log(paymentIntent)
      
        res.status(200).send({paymentIntent,client_secret:paymentIntent.client_secret})
    

      
    } catch (error) {
      console.log(error)
    }
  },
  getStripeAPI:async (req,res)=> {
    
try {
  const userId  =req.params.userId
  const result = await Payments.find({userId:userId,paymentSystem:'Stripe'});
  console.log(userId)
if(result&&result.length>=1) {
  res.status(200).send(result[0])
} else {
  res.send({message:'not found'})
}
} catch (error) {
  res.send(error)
  console.log(error)
}
  }
  
  
};
