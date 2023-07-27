//create schema structure of document
const mongoose = require("mongoose")

const foodSchema = new mongoose.Schema({
    foodId : String,
    quantity: Number,
    price: Number,
  });


const orderSchema = new  mongoose.Schema({
    userId : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    userName : {
        type : String,
        required : true
    },
    createdAt: {
        type : Date,
        default : Date.now, 
        required : true
      },
    food : {
        type : [foodSchema],
        required : true
    },
    paymentMethod : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true
    },
    totalPrice : {
        type : Number,
        required : true
    }
    
});

//define Model
const Orders = mongoose.model("Orders", orderSchema)

module.exports = Orders;



