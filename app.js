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
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');
const {sendConfirmationEmail} = require('./email/mailer');


mongoose.connect(process.env.DB_PASS);
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

app.use(cors())
app.options('*', cors())

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
                newUser.save()
                .then(data => {
                    // sendConfirmationEmail({toUser: newUser.data, hash: newUser.data._id});
                    response.status(200).send(data);
                    console.log('saved');
                })
                .catch(error => {
                    response.status(200).send({msg:"username/password is not exist"});
                })
                await sendConfirmationEmail({toUser: newUser.data, hash: newUser.data._id})
                console.log('finished user');
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
// app.get('/confirm/:id', validateEmailb )

app.get('/getMembers', auth, async function (request, response) {
    signUpTemplate.find({})
        .select('NickName Power.Soldiers.Ammount')
        .then(data => response.status(200).send(data))
        .catch(error => console.log(error));
});
// const updateRes = schedule.scheduleJob('*/1 * * * * *', function(){
//   signUpTemplate.updateMany({},
//     { $: 
//         {"Resources.Gold": "Workers.Efficiency.Mine"}
//     }, function(err, response){
//         if(err) console.log(err);
//         else console.log(response); 
//     });
// });
app.listen(port, function () {
 console.log(`Example app listening on port !`);
});