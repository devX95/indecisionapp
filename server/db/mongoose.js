const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/node-form', {
    useMongoClient: true
});

module.exports = {mongoose};