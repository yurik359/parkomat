const { User } = require("../models/user");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const {secret} = require('../config')
const { parkomatItem } = require("../models/parkomatItem");
const { Parkomat } = require("../models/parkomatItem");
const generateAccessToken = (payload) =>{

return jwt.sign(payload,secret,{expiresIn:'24h' })
}


module.exports = {
  registration:async (req, res) =>{
    try {
      const { organizationName, email, password } = req.body;
      
      const candidate = await User.findOne({ email });
      if (candidate) {
        return res.status(401).json({ message: "user with this email already exists" , status:'401'});
      }
      const hashPassword = bcrypt.hashSync(password,5);
      const user = await User.create({ organizationName, password:hashPassword,email });
      
      const token = jwt.sign({id:user._id},secret,{expiresIn:'24h' })

      return res.json({message:'User registered successfully',token})
    } catch (error) {
      res.status(401).json({ message: "Registration error" });
    }
  },
  login:async(req, res) =>{
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user ) {
          res.status(401).send({ message: "wrong password or email" });
          return;
        }
        const validPassword = bcrypt.compareSync(password,user.password)
        
        if(!validPassword) {
            
            return res.status(400).json({message:'wrong password or email'})
        }
        
        const token = jwt.sign({id:user._id},secret,{expiresIn:'24h' })
        
        res.status(200).json({ message: "Login successful", token });
      }
     catch (error) {
        console.log(error)
      res.status(400).json({ message: "login error" });
    }
  },
  sendInstruction:async (req,res) => {
    try {
        const {emailRecover} = req.body
        
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
},
changePassword:async (req,res) => {
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
                
                   res.send({message:'password successful changed',status:'ok'})
                }
              })
        } catch (error) {
            res.send({message:'error during changing password',status:'error'})
        }
    },
    getParkomatList:async (req,res) => {


      try {
          
           const {accessToken } = req.body;
              
        jwt.verify(accessToken, secret,async (err, decoded) => {
          if (err) {
              res.status(403).send({message:err})
            console.error('Error decode  token', err);
          } else {
              const {id} = decoded
             
             const parkomatList= await Parkomat.findOne(
              { ['userId']: id }, 
              { parkomatItemsArray: 1 }
             )
             console.log(parkomatList)
            res.send({parkomatList})
             
  
            
          }
        })
      } catch (error) {
          console.log(error)
          res.send({message:error})
      }
  }
}
// class usersController {
//   async registration(req, res) {
//     try {
//       const { organizationName, email, password } = req.body;
      
//       const candidate = await User.findOne({ email });
//       if (candidate) {
//         return res.status(401).json({ message: "user with this email already exists" , status:'401'});
//       }
//       const hashPassword = bcrypt.hashSync(password,5);
//       const user = await User.create({ organizationName, password:hashPassword,email });
//       await parkomatItem.create({
//         _id:user._id,
//         parkomatItemsArray:[]
//       })
//       const token = jwt.sign({id:user._id},secret,{expiresIn:'24h' })

//       return res.json({message:'User registered successfully',token})
//     } catch (error) {
//       res.status(401).json({ message: "Registration error" });
//     }
//   }

//   async login(req, res) {
//     try {
//         const { email, password } = req.body;
        
//         const user = await User.findOne({ email });
        
//         if (!user ) {
//           res.status(401).send({ message: "wrong password or email" });
//           return;
//         }
//         const validPassword = bcrypt.compareSync(password,user.password)
        
//         if(!validPassword) {
            
//             return res.status(400).json({message:'wrong password or email'})
//         }
        
//         const token = jwt.sign({id:user._id},secret,{expiresIn:'24h' })
        
//         res.status(200).json({ message: "Login successful", token });
//       }
//      catch (error) {
//         console.log(error)
//       res.status(400).json({ message: "login error" });
//     }
//   }

//   async getUsers(req, res) {
//     try {
//       res.json("server work");
//     } catch (error) {
//       res.status(400).json({ message: "Registration error" });
//     }
//   }
// }

// module.exports = new usersController();
