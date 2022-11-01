const jwt = require('jsonwebtoken');

const verifyJwt = (req,res,next) => {
    console.log('entered middle');
    const header = req.header('Authorization');
    const token = header && header.split(' ')[1];
    if (!token){ 
        return res.status(401).send({msg:"Please login first"})
    }
    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
        if(err){ 
            return res.status(403).send({msg:"Not authoraized"})
        }
        req.token = token;
        next();
    });
}

module.exports = verifyJwt