//create schema structure of document
const mongoose = require("mongoose")
const foodSchema = new  mongoose.Schema({
    foodName : {
        type : String,
        required : true
    },
    orgPrice : {
        type : Number,
        required : true
    },
    discPrice : {
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    // image : {
    //     type : String,
    //     required : true
    // },
    type : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    ingredients : {
        type : String,
        required : true
    },
    status : {
        type : Boolean,
        required : true
    },
    
})

//define Model
const Foods = mongoose.model("Foods", foodSchema)

module.exports = Foods;



