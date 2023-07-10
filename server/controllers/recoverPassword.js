const { parkomatItem } = require("../models/parkomatItem");
const { User } = require("../models/user");
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const {secret} = require('../config')
const bcrypt = require('bcryptjs')
class recoverPassword {
    
    sendInstruction = async (req,res) => {
        try {
            const {emailRecover} = req.body
            console.log(emailRecover)
            const user = await User.findOne({ email:emailRecover });
            if (user) {
                    console.log(user._id)
                const token = jwt.sign({id:user._id},secret,{expiresIn:'1h' })
                let transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                      user: 'yurik52222@gmail.com',
                      pass: 'ucoxmzhrvzmdbjmp',
                    },
                  });
                  let mailOptions = {
                    from: 'yurik52222@gmail.com',
                    to: emailRecover,
                    subject: 'Test Email',
                    text: ` http://localhost:4001/recover-page?code=${token}`,
                  };
                  transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                      console.error('error', error);
                    } else {
                      console.log('send email successfuly', info.response);
                      res.send({message:'on your email was sent instructions to change password'})
                    }
                  });
                 

            } else {
                res.send({message:'no user found with this email'})
            }
        } catch (error) {
            res.send({message:error})
        }
}
    changePassword = (req,res) => {
        try {
            const {code,password} = req.body
            console.log(code,password)
            jwt.verify(code, secret,async (err, decoded) => {
                if (err) {
                    res.status(401).send({message:err})
                  console.error('Error decode  token', err);
                } else {
                    const {id} = decoded
                    const hashPass=bcrypt.hashSync(password,5);
                    await User.updateOne(
                        { _id: id },
                        { $set: { password: hashPass } }
                      );
                
                   res.send({message:'password successful changed'})
                }
              })
        } catch (error) {
            
        }
    }

}


module.exports = new recoverPassword()