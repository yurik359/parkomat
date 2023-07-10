const path = require("path");
const express = require("express");
const router = express.Router();
const usersController  = require('../controllers/Users')
const actionWithParkomat = require('../controllers/actionWithParkomat')
const getParkomatList = require('../controllers/getParkomatList')
const deleteEdit = require('../controllers/deleteEdit')
const recoverPassword = require('../controllers/recoverPassword')

router.post("/register",usersController.registration);
router.post("/login",usersController.login);
router.get('/getUsers',usersController.getUsers )
router.post('/addParkomat',actionWithParkomat.addParkomat)
router.post('/updateParkomat',actionWithParkomat.updateParkomat)
router.post('/getParkomatList',getParkomatList)
router.post('/deleteParkomat',deleteEdit.deleteParkomat)
router.post('/sendEmail',recoverPassword.sendInstruction)
router.post('/changePassword',recoverPassword.changePassword)

router.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
  });




  module.exports = router;