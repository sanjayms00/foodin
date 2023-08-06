
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items: {
        type : [],
        ref : "Foods"
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref: 'Users'
    },
    address: {
        type : String,
        require : true 
    },
    userName: {
        type : String,
        require : true 
    },
    time: {
        type : Date,
        require : true 
    },
    status: {
        type : String,
        require : true 
    },
    paymentStatus: {
        type : String,
        require : true 
    },
    paymentMethod: {
        type : String,
        require : true 
    },
    subTotal: {
        default: 0,
        type: Number,
        required : true
    }
});

const Orders = mongoose.model("Orders", orderSchema)

module.exports = Orders;

