'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));


app.get('/', function(req, res) {
    res.render('index');
});



app.listen(process.env.PORT || 5000, function() {
    console.log('Local Server : http://localhost:5000');
});