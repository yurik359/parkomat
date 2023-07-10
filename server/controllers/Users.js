const { User } = require("../models/user");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {secret} = require('../config')
const { parkomatItem } = require("../models/parkomatItem");
const generateAccessToken = (payload) =>{

return jwt.sign(payload,secret,{expiresIn:'24h' })
}
class usersController {
  async registration(req, res) {
    try {
      const { organizationName, email, password } = req.body;
      
      const candidate = await User.findOne({ organizationName });
      if (candidate) {
        return res.status(400).json({ message: "user already exists" });
      }
      const hashPassword = bcrypt.hashSync(password,5);
      const user = await User.create({ organizationName, password:hashPassword,email });
      await parkomatItem.create({
        _id:user._id,
        parkomatItemsArray:[]
      })
      const token = jwt.sign({id:user._id},secret,{expiresIn:'24h' })

      return res.json({message:'User registered successfully',token})
    } catch (error) {
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user ) {
          res.status(401).send({ message: "User not found" });
          return;
        }
        const validPassword = bcrypt.compareSync(password,user.password)
        
        if(!validPassword) {
            
            return res.status(400).json({message:'wrong password'})
        }
        
        const token = jwt.sign({id:user._id},secret,{expiresIn:'24h' })
        
        res.status(200).json({ message: "Login successful", token });
      }
     catch (error) {
        console.log(error)
      res.status(400).json({ message: "login error" });
    }
  }

  async getUsers(req, res) {
    try {
      res.json("server work");
    } catch (error) {
      res.status(400).json({ message: "Registration error" });
    }
  }
}

module.exports = new usersController();
