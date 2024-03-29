var express = require("express");
var app = express();
const cors = require('cors');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const signUpTemplate = require('./models/UserTemplate');
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const auth = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const {sendConfirmationEmail} = require('./email/mailer');
const {attackMember, getReports, buyItem} = require('./attack/attackMember');
require('dotenv').config();


mongoose.connect(process.env.DB_PASS);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connection Successful!");
})

app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true
}));

app.use(cors());
app.options('*', cors());

app.get('/', function (request, response) {
});
app.get('/getCookie', auth, function (request, response) {
    response.status(200).send({valid: true});
});
app.post('/login', async function (request, response) {
    try{
        const {Email,password} = request.body
        console.log({Email,password});
        console.log('before finding');
        signUpTemplate.findOne({Email:Email}).then(async (user) => {
            if(!user){
                return response.status(200).send({msg:"username/password is not exist"})
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
                    console.log(token);
                    return response.status(200).send(token)
                }
                else{
                    return response.status(200).send({msg:"username/password is not exist"})
                }
            }
        })
    }
    catch(e){
        console.error(e);
    }
});
app.post('/register', async function (request, response) {
    const {NickName,Email,password, avatar} = request.body;
    console.log({NickName,Email,password});
    try{
        console.log('before finding');
        signUpTemplate.findOne({Email:Email}).then(async (user) => {
            if ( user ) {
                console.log('user exist');
                response.status(200).send({msg:"User already exist"});
            }
            else {
                console.log('starts to create user');
                const securePass = await bcrypt.hash(password, 10);
                console.log('enc pass');
                const newUser = new signUpTemplate({
                    NickName: NickName,
                    Email: Email,
                    password: securePass,
                    avatar: avatar,
                    Power :{
                        Items: {
                            name:'Wand',
                            power: 10
                        }
                    }
                });
                await newUser.save();
                console.log(newUser);
                await sendConfirmationEmail({toUser: newUser, hash: newUser._id});
                response.send(newUser);

            }
        });
    }catch{
        console.log('was an error with creating user');
    }
    console.log('pass reg post');
});
app.get('/getResources', auth, async function (request, response) {
    const token = request.token;
    const decode = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    signUpTemplate.find({_id:decode.user_id})
        .select('Resources Workers Power avatar')
        .then(data => response.status(200).send(data))
        .catch(error => console.log(error));
});
app.get('/confirm/:hash', async function (request, response) {
    const {hash} = request.params;
    signUpTemplate.findOne({_id: hash}).then(async (user) =>{
        if(!user) return response.status(422).send("User is not found");
        signUpTemplate.updateOne({_id: user._id}, {isVerified: true}, function (err, use){
            if(err) return console.log(err)
            return response.redirect('https://fight-club-vs.vercel.app/confirm')
        })
    })
});

app.get('/getMembers', auth, async function (request, response) {
    signUpTemplate.find({isVerified:true})
        .select('NickName Resources.Gold Power.Soldiers.Ammount alliance avatar')
        .then(data => response.status(200).send(data))
        .catch(error => console.log(error));
});

app.post('/attack/:id', auth, attackMember);

app.get('/report/:id', auth, getReports);

app.post('/shopping', auth, buyItem);

schedule.scheduleJob('*/15 * * * *', function(){
    signUpTemplate.find({isVerified: true})
    .select('Resources Workers')
    .then(data => {
        data.map(member => {
            const {Workers} = member;
            const goldToAdd = Workers.Efficiency.Mine * Workers.Mine;
            const foodToAdd = Workers.Efficiency.Farm * Workers.Farm;
            const solfourToAdd = Workers.Efficiency.Mountains * Workers.Mountains;
            const marbleToAdd = Workers.Efficiency.Quary * Workers.Quary;
            signUpTemplate.findOneAndUpdate({_id:member._id},
                {$inc: {
                    "Resources.Gold" : goldToAdd,
                    "Resources.Food": foodToAdd,
                    "Resources.Solfour": solfourToAdd,
                    "Resources.Marble": marbleToAdd
                }},{new: true }, function (err, use){
                    if (err) console.log(err);
                    else console.log(use);
                })
        })
    })
    .catch(error => console.log(error))
});

schedule.scheduleJob('30 20 * * *', function(){
    signUpTemplate.find({isVerified: true})
    .select('Workers')
    .then(data => {
        data.map(member => {
            const {Workers} = member;
            signUpTemplate.findOneAndUpdate({_id:member._id},
                {$inc: {
                    "Workers.Available" : 30
                }},{new: true }, function (err, use){
                    if (err) console.log(err);
                    else console.log(use);
                })
        })
    })
    .catch(error => console.log(error))
});


app.listen(port, function () {
 console.log(`Example app listening on port !`);
});