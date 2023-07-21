const path = require("path");
const express = require("express");
const router = express.Router();
const {registration,login,sendInstruction,changePassword,getParkomatList}  = require('../controllers/Users')
const {verifyToken} = require('../config')
const {addParkomat,updateParkomat,deleteParkomat} =require('../controllers/itemController')





router.post("/register",registration);
router.post("/login",login);

router.post('/addParkomat',verifyToken,addParkomat)
router.post('/updateParkomat',verifyToken,updateParkomat)
router.post('/getParkomatList',getParkomatList)
router.post('/deleteParkomat',verifyToken,deleteParkomat)
router.post('/sendEmail',sendInstruction)
router.post('/changePassword',changePassword)

router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });





  module.exports = router;