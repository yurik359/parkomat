const path = require("path");
const express = require("express");
const router = express.Router();
const {registration,login,sendInstruction,changePassword,getParkomatList}  = require('../controllers/Users')
const {verifyToken} = require('../config')
const {addParkomat,updateParkomat,deleteParkomat,getAddresses,getPlaceId,sendPaymentURL,getAllParkomats} =require('../controllers/itemController')





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
router.get('/getPaymentUrl:parkomatId',sendPaymentURL)
router.get('/getAllParkomats:parkomatId',getAllParkomats)
router.post('/thank', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/public/thankYou.html'));
});
router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });







  module.exports = router;