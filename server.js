var express = require('express');
var app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.set('views',"./views");
app.use("/scripts",express.static(__dirname + "/node_modules/web3.js-browser/build"))
var server = require('http').Server(app);
server.listen(3000);
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({ extended:false }));
app.use(bodyparser.json());

//MongoDB nienluan1 dNXSPapLVUa8iVsv
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://nienluan1:dNXSPapLVUa8iVsv@clusterstudy.a5alv.mongodb.net/nienluan?retryWrites=true&w=majority', { useNewUrlParser: true },function(err){
    if (err) {
        console.log("MongoDB connected error! " + err.message);
    }
    else {
        console.log("MongoDB connected!");
    }
});

require('./controllers/khaibao')(app);