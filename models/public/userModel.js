//create schema structure of document
const mongoose = require("mongoose")
const userSchema = new  mongoose.Schema({
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : Number,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String
    },
    addresses : {
        type : [Object]
    },
    cart : {
        type : [Object]
    },
    isVarified : {
        type : Boolean,
        required :true
    },
    blocked : {
        type : Boolean,
        required : true
    }
})

//define Model
const Users = mongoose.model("Users", userSchema)

module.exports = Users;



