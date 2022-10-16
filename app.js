var express = require("express");
const cors = require('cors');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var app = express();
var whitelist = ['https://powerful-anchorage-21815.herokuapp.com'];
var corsOptions = {
    origin: function(origin, callback){
    var originWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originWhitelisted);
    }
};
mongoose.connect("mongodb+srv://vercel-admin-user:A9b-hCcprdDBfGQ@cluster0.mqyicqe.mongodb.net/?retryWrites=true&w=majority");
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connection Successful!");
})
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});
app.get('/', function (req, res) {
 res.send(JSON.stringify({ Hello: "World"}));
});
app.post('/login', async function (request, response) {
    try{
        const {Email,password} = request.body
        console.log({Email,password});
        console.log('before finding');
        signUpTemplate.findOne({Email:Email}).then(async (user) => {
            if(!user){
                console.log('found user');
                console.log('username/password is not exist');
                response.status(400).send({msg:"username/password is not exist"})
            }
            else{
                const NickName = user.NickName;
                if(await bcrypt.compare(password, user.password)){
                    const token = jwt.sign(
                        { user_id: user.id, NickName },
                        process.env.TOKEN_KEY,
                        {
                          expiresIn: "2h",
                        }
                    );
                    user.token = token;
                    response.status(200).json(user);
                }
                else{
                    console.log('username/password is not exist');
                    response.status(400).send({msg:"username/password is not exist"})
                }
            }
        })
    }
    catch(e){
        console.error(e);
    }
});
app.listen(port, function () {
 console.log(`Example app listening on port !`);
});