var express = require("express");
const cors = require('cors')
var port = process.env.PORT || 3000;
var app = express();
app.use(cors());
app.get('/', function (req, res) {
 res.send(JSON.stringify({ Hello: "World"}));
});
app.get('/try', function (req, res) {
    res.status(200).send({msg: "Amit Hagever"});
});
app.listen(port, function () {
 console.log(`Example app listening on port !`);
});