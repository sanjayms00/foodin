//create schema structure of document
const mongoose = require("mongoose")


const addressSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true
    }, 
    mobileNumber : {
            type : Number,
            required : true
        }, 
    pinCode : {
        type : Number,
        required : true
    }, 
    addressLine : {
        type : String,
        required : true
    }, 
    city : {
        type : String,
        required : true
    }, 
    state : {
        type : String,
        required : true
    }, 
    addressType : {
        type : String,
        required : true
    }
})



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
        type: String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    image : {
        type : String
    },
    defaultAddress  : {
        type : mongoose.Schema.Types.ObjectId
    },
    addresses : {
        type : [addressSchema]
    },
    cart : {
        type : [Object]
    },
    confirmSecret : {
        type : String,
    },
    tempSecret : {
        type : String,
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



