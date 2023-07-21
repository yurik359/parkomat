const jwt = require('jsonwebtoken');
module.exports ={ 
    secret: 'SECRET_KEY',
    verifyToken: (req, res, next) => {
        const accessToken = req.body.accessToken || req.query.accessToken || req.headers['x-access-token'];
      
        if (!accessToken) {
          return res.status(403).json({ message: 'Access token not provided' });
        }
      
        jwt.verify(accessToken, 'SECRET_KEY', (err, decoded) => {
          if (err) {
            
            return res.status(403).send({message:err})
          }
      
          req.decoded = decoded;
          next();
        });
      }
}

