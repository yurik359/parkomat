const jwt = require('jsonwebtoken');
module.exports ={ 
    secret: 'SECRET_KEY',
    verifyToken: (req, res, next) => {
        const accessToken =req.headers['x-access-token']|| req.body.accessToken || req.query.accessToken||req.body.temporaryToken ;
        
        if (!accessToken) {
          return res.status(401).json({ message: 'Access token not provided' });
        }
       
          
        
          jwt.verify(accessToken, 'SECRET_KEY', (err, decoded) => {
            if (err) {
              
              return res.status(401).send({message:err})
            }
        
            req.decoded = decoded;
            next();
          });
        
      
        
      }
}


