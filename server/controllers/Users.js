const { User } = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { secret } = require("../config");
const { parkomatItem } = require("../models/parkomatItem");
const { Parkomat } = require("../models/parkomatItem");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
require('dotenv').config({ path: 'sensativeInfo.env' });

const generateAccessToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};

module.exports = {
  registration: async (req, res) => {
    try {
      const { organizationName, email, password,phoneNumber,twoFa } = req.body;
      

      const candidate = await User.findOne({ email });
      if (candidate) {
        return res
          .status(401)
          .json({
            message: "user with this email already exists",
            status: "401",
          });
      }
      const hashPassword = bcrypt.hashSync(password, 5);
      const user = await User.create({
        organizationName,
        password: hashPassword,
        email,
        phone:phoneNumber,
      });

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: "24h" });
      
      if(twoFa) {
        const secretKey_TwoFa = speakeasy.generateSecret({
          _id: user._id,
        });
        const temporaryToken = jwt.sign({ id: user._id,secretKey_TwoFa:secretKey_TwoFa.base32 }, secret, { expiresIn: "15m" });
        
        const otpauth_url = `otpauth://totp/Parking_Admin:${user.email}?secret=${secretKey_TwoFa.base32}`
        const qrDataURL = await QRCode.toDataURL(otpauth_url)
        return res.json({ message: "User registered successfully",qrDataURL,temporaryToken })
      }
      return res.json({ message: "User registered successfully", token, });
    } catch (error) {
      res.status(401).json({ message: "Registration error" });
      console.log(error);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        console.log('not found')
        res.status(401).send({ message: "wrong password or email" });
        return;
      }
      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(401).json({ message: "wrong password or email" });
      }
     
      if (user.secretKey_TwoFa) {
        const temporaryToken = jwt.sign({ id: user._id,secretKey_TwoFa:user.secretKey_TwoFa }, secret, { expiresIn: "15m" });
        res.status(200).json({ message: "Login successful", twoFa:true,temporaryToken });
      } else {
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: "24h" });
 res.status(200).json({ message: "Login successful", token });
      }


      

     
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "login error" });
    }
  },
  checkTwoFa: async (req, res) => {
    try {
      const { id,secretKey_TwoFa } = req.decoded;
      const userTokenTwoFA = req.body.twoFaValue;
      
      const user = await User.findOne({ _id: id });
      
  
    const verified = speakeasy.totp.verify({
      secret: user.secretKey_TwoFa?user.secretKey_TwoFa:secretKey_TwoFa,
      encoding: "base32",
      token: userTokenTwoFA,
    });
   
    if (verified) {
      if(!user.secretKey_TwoFa){
  await User.updateOne(
      { _id: id },
      { $set: { secretKey_TwoFa } }
    );
      }
    
      const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "24h" });
   res.send({accessToken})
    } else {
   res.send({message:'wrong pin'})
    }
  
        
       
      
    } catch (error) {
      console.log(error)
    }
  },
  sendInstruction: async (req, res) => {
    try {
      const { emailRecover } = req.body;
      
      const user = await User.findOne({ email: emailRecover });
      if (user) {
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
        let transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        let mailOptions = {
          from: "kasdks@gmail.com",
          to: emailRecover,
          subject: "PayParking access recover",
          text: `https://api.pay-parking.net/recover-page?code=${token}`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("error", error);
          } else {
            console.log("send email successfuly", info.response);
            res.send({
              message: "on your email was sent instructions to change password",
            });
          }
        });
      } else {
        res.send({ message: "no user found with this email" });
      }
    } catch (error) {
      res.send({ message: error });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { code, password } = req.body;

      jwt.verify(code, secret, async (err, decoded) => {
        if (err) {
          res.status(401).send({ message: err });
          console.error("Error decode  token", err);
        } else {
          const { id } = decoded;
          const hashPass = bcrypt.hashSync(password, 5);
          await User.updateOne({ _id: id }, { $set: { password: hashPass } });

          res.send({ message: "password successful changed", status: "ok" });
        }
      });
    } catch (error) {
      res.send({ message: "error during changing password", status: "error" });
    }
  },
  getParkomatList: async (req, res) => {
    try {
      const { id } = req.decoded;
      
      const parkomatList = await Parkomat.find({ userId: id });

      
      res.send(parkomatList);
    } catch (error) {
      console.log(error);
      res.send({ message: error });
    }
  },
  
};

