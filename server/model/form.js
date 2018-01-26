const mongoose = require('mongoose');
const validator = require('validator');

var formSchema = mongoose.Schema({

    name: {
        required: true,
        type: String,
        trim: true,
        minlength: 3
    },

    email: {
        required: true,
        type: String,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },

    city: {
        required: true,
        trim: true,
        type: String
    },

    age: {
        required: true,
        type: String,
        trim: true
    },

    gender: {
        required: true,
        type: String
    },

    faculty: {
        required: true,
        type: String,
        trim: true
    }
}, {
    collection: 'forms'
});

var Form = mongoose.model('Form', formSchema);

var createForm = (name, email, city, age, gender, faculty) => {
    return {
        name,
        email,
        city,
        age,
        gender,
        faculty
    };
};

module.exports = {Form, createForm};