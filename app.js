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
const workersTemplate = require('./models/WorkersModel');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');


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
                    Available_Workers: 10,
                    Gold: 750,
                    Solfour: 750,
                    Marble: 750,
                    Food: 750,
                    Vault_Gold: 0,
                    Vault_Solfour: 0,
                    Vault_Marble: 0,
                    Vault_Food: 0
                });
                const workers = new workersTemplate({
                    UserId: "",
                    ResourcesId: "",
                    Workers: 20,
                    Mine: 5,
                    Farm: 5,
                    Quary: 5,
                    Mountains: 5,
                    Mine_Efficiency: 1,
                    Farm_Efficiency: 1,
                    Quary_Efficiency: 1,
                    Mountains_Efficiency: 1
                });
                resources.UserId = newUser._id;
                workers.ResourcesId = resources._id;
                workers.UserId = newUser._id;
                await resources.save();
                await workers.save();
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
app.get('/getResources', auth, async function (request, response) {
    const token = request.token;
    const decode = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    signUpTemplate.find({_id:decode.user_id})
        .select('Resources Workers Power')
        .then(data => response.status(200).send(data))
        .catch(error => console.log(error));
});

const updateRes = schedule.scheduleJob('*/1 * * * * *', function(){
//   signUpTemplate.updateMany({},
//     { $inc: 
//         {'Resources.Gold': 1, 'Resources.Marble': 1,'Resources.Food': 1,'Resources.Solfour': 1}
//     }, function(err, response){
//         if(err) console.log(err);
//         else console.log(response);
//     });
    console.log('Amit');
});
app.listen(port, function () {
 console.log(`Example app listening on port !`);
});