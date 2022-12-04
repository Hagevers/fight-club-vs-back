const jwt = require('jsonwebtoken');
const user = require('../models/UserTemplate');

const verifyJwt = (req,res,next) => {
    console.log('entered middle');
    const header = req.header('Authorization');
    const token = header && header.split(' ')[1];
    if (!token){ 
        return res.status(401).send({msg:"Please login first"})
    }
    let code = jwt.decode(token);
    user.findOne({_id: code.user_id})
    .select('isVerified')
    .then(data =>{
        console.log(data.isVerified);
        if (data.isVerified === false){
            return res.status(403).send({msg: "User not authenticate yet"})
        }else{
            jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
                if(err){ 
                    return res.status(403).send({msg:"Not authoraized"})
                }
                req.token = token;
                next();
            });
        }
    })
}

module.exports = verifyJwt