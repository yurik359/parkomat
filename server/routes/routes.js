const path = require("path");
const express = require("express");
const router = express.Router();
const {registration,login,sendInstruction,changePassword,getParkomatList,checkTwoFa}  = require('../controllers/Users')
const {savePaymentInfo,getPaymentsSystems,AppovedPaymentsInfo,getPaymentStatistic,getTimeRange,getForPie,howMuchToPay} =require('../controllers/payments')
const {verifyToken} = require('../config')
const {addParkomat,updateParkomat,
  deleteParkomat,getAddresses,
  getPlaceId,sendPaymentURL,
  getAllParkomats,
  getAroundParkomats,
  checkParkomat,
  addCard,
  payCommission,
  handlerClientPayment
} =require('../controllers/itemController')





router.post("/register",registration);
router.post("/login",login);

router.post('/addParkomat',verifyToken,addParkomat)
router.put('/updateParkomat',verifyToken,updateParkomat)
router.get('/getParkomatList',verifyToken,getParkomatList)
router.delete('/deleteParkomat',verifyToken,deleteParkomat)
router.post('/sendEmail',sendInstruction)
router.post('/changePassword',changePassword)
router.get('/getAddresses',getAddresses)
router.get('/getPlaceId:placeId',getPlaceId)
router.get('/getPaymentUrl/:parkomatId/:userId',sendPaymentURL)
router.get('/getAllParkomats',getAllParkomats)
router.get('/getAroundParkomats',getAroundParkomats)
router.get('/checkParkomat/:parkomatId',checkParkomat)
router.post('/checkTwoFa',verifyToken,checkTwoFa)
router.post('/savePaymentInfo',verifyToken,savePaymentInfo)
router.get('/getPaymentsSystems',verifyToken,getPaymentsSystems)
router.get('/getPaymentStatystic',verifyToken,getPaymentStatistic)
router.post('/getTimeRange',verifyToken,getTimeRange)
router.get('/getForPie',getForPie)
router.post('/thank',AppovedPaymentsInfo);
router.get('/addCard',verifyToken,addCard)
router.get('/howMuchToPay',verifyToken,howMuchToPay)
router.get('/payCommission',verifyToken,payCommission)
router.post('/handlerClientPayment',handlerClientPayment);

router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });







  module.exports = router;