const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    
    email : {
        type : String,
        required: true,
        unique: true,
    },

    //already present in passport-local-mongoose

    // username : {
    //     type : String,    
    //     required: true,
    //     unique: true,
    // },
    // password : {
    //     type : String,
    //     required: true,
    // },
});

userSchema.plugin(passportLocalMongoose); 
// adds username and password fields, and handles hashing and salting of the password



module.exports = mongoose.model("User", userSchema);