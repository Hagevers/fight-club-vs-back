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
    console.log('All good!');
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
                    avatar: avatar
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
        .select('NickName Power.Soldiers.Ammount alliance')
        .then(data => response.status(200).send(data))
        .catch(error => console.log(error));
});

const updateRes = schedule.scheduleJob('*/1 * * * *', function(){
    signUpTemplate.find({isVerified: true})
    .select('Resources Workers')
    .then(data => {
        data.map(member => {
            // const {Gold} = member.Resources
            // console.log('this is the Gold he has', Gold);
            // const {Workers} = member
            // console.log('this is the Workers stats', Workers);
            // Gold = Gold + (Workers.Efficiency.Mine * Workers.Mine);
            // console.log('this is the gold to add', addGold);
            console.log(member);
            // member.updateOne({},{}, function(err, resource) {
            //     if(err) console.log(err);
            //     else console.log(resource);
            // })
            signUpTemplate.updateOne({},{$inc: {"Resources.Gold" : 1}})
        })
    })
    .catch(error => console.log('Error before updating resources'))
//   signUpTemplate.updateMany({},
//     { $: 
//         {"Resources.Gold": "Workers.Efficiency.Mine"}
//     }, function(err, response){
//         if(err) console.log(err);
//         else console.log(response); 
//     });
});


app.listen(port, function () {
 console.log(`Example app listening on port !`);
});