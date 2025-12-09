const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema({
    name: { 
        type: String,
        minlength: 6, 
        maxlength: 30,
        required: true },
    email: { 
        type: String, 
        required: true,
        maxlength: 50, 
        unique: true },
    password: { 
        type: String, 
        required: true },
}, { timestamps: true });   
module.exports = mongoose.model('user', User, 'users');