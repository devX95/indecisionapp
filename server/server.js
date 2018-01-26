const express = require('express');
const http =require('http');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const path = require('path');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Form, createForm} = require('./model/form');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var publicPath = path.join(__dirname, '../public');

app.use(bodyParser.json());
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New User Connected');
    socket.emit('connection', () => {
        
    });
    socket.on('saveForm', (newForm, callback) => {
        console.log('saving');
        var form = new Form(createForm(newForm.name, newForm.email, newForm.city, newForm.age, newForm.gender, newForm.faculty));
        form.save().then(form => {
            callback(form);
        }).catch(error => {
            console.log(error);
            callback(undefined, error);
        });
    });

    socket.on('getAllForms', callback => {
        console.log('getting forms');
        Form.find().then(forms => {
            callback(forms);
        }).catch(error => {
            callback(undefined, error);
        });
    });

    socket.on('getForm', (id, callback) => {
        Form.findOne({_id: id}).then(form => {
            callback(form);
        }).catch(error => {
            callback(form);
        });
    });

    socket.on('search', (input, callback) => {
        Form.find({
            $or:[{
                name: {$regex : new RegExp(input, "i")},
            }, {
                email: {$regex : new RegExp(input, "i")}
            }, {
                city: {$regex : new RegExp(input, "i")}
            }]
        }).then(forms => {
            callback(forms);
        }).catch(error => {
            callback(undefined, error);
        });
    });
});

app.get('/', (request, response) => {
    response.send(publicPath + '/index.html');
});

server.listen(3000, () => {
    console.log('Server Up on port 3000');
});