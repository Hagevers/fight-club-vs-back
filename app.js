var express = require("express");
var app = express();
const cors = require('cors');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const signUpTemplate = require('./models/UserTemplate');
const bodyparser = require('body-parser');
var port = process.env.PORT || 3000;
const auth = require('./middlewares/auth');
const resourcesTemple = require('./models/ResourcesModel');
const cookieParser = require('cookie-parser');
var whitelist = ['https://powerful-anchorage-21815.herokuapp.com','http://localhost:3000'];
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

app.use(cookieParser())
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

// var corsOptions = {
//     origin: ["https://fierce-caverns-88917.herokuapp.com","http://localhost:3000"],
//     optionsSuccessStatus: 200 ,// For legacy browser support
//     withCredentials: true
// }
    
app.use(cors(corsOptions));
app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", "https://fierce-caverns-88917.herokuapp.com");
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000");  // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);

    next();
  });  
app.get('/', function (req, res) {
 res.send(JSON.stringify({ Hello: "World"}));
});
app.get('/getCookie', async function (request, response) {
    var cook = request.cookies
    if (cook){
        return response.send(`Already has cookie ${cook}`);
    }
});
app.post('/login', async function (request, response) {
    try{
        console.log(request);
        console.log(request.body);
        const {Email,password} = request.body
        console.log({Email,password});
        console.log('before finding');
        signUpTemplate.findOne({Email:Email}).then(async (user) => {
            if(!user){
                return response.status(403).send({msg:"username/password is not exist"})
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
                    response.cookie('token', token, { maxAge: 900000, httpOnly: true });
                    return response.redirect('/');
                }
                else{
                    return response.status(403).send({msg:"username/password is not exist"})
                }
            }
        })
    }
    catch(e){
        console.error(e);
    }
});
app.post('/register', async function (request, response) {
    const {NickName,Email,password} = request.body;
    console.log({NickName,Email,password});
    try{
        console.log('before finding');
        signUpTemplate.findOne({Email:Email}).then(async (user) => {
            if ( user ) {
                console.log('user exist');
                response.status(400).send({msg:"User already exist!"})
            }
            else {
                console.log('starts to create user');
                const securePass = await bcrypt.hash(password, 10);
                console.log('enc pass');
                const newUser = new signUpTemplate({
                    NickName: NickName,
                    Email: Email,
                    password: securePass,
                });
                const resources = new resourcesTemple({
                    UserId: "",
                    Gold: 750,
                    Solfour: 750,
                    Marble: 750,
                    Food: 750
                });
                resources.UserId = newUser._id;
                await resources.save();
                newUser.save()
                .then(data => {
                    
                    resources.save()
                    response.status(200).send(data);
                    console.log('saved');
                })
                .catch(error => {
                    response.status(500).send(error);
                    console.log('not saved');
                })
                console.log('finished user');
            }
        });
    }catch{
        console.log('was an error with creating user');
    }
    console.log('pass reg post');
});
app.get('/resources', async function (request, response) {
    console.log(request.cookies['tokener']);
    // const token = request.headers['token'];
    // console.log(token);
    // const decode = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    // resourcesTemple.find({UserId:decode.user_id})
    //     .select('Food Marble Solfour Gold')
    //     .then(data => response.status(200).send(data))
    //     .catch(error => console.log(error));
});
app.listen(port, function () {
 console.log(`Example app listening on port !`);
});