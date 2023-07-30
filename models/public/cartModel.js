
const mongoose = require("mongoose")

const cartSchema = new  mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    // grandTotal : {
    //     type : Number,
    //     required : true
    // },
    items : {
        type : [{
            foodId : {
                type : mongoose.Schema.Types.ObjectId,
                required : true
            },
            foodName : {
                type : String,
                required : true
            },
            price : {
                type : Number,
                required : true
            },
            qty : {
                type : Number,
                required : true
            },
            totalPrice : {
                type : Number
            },
            createdAt : {
                type : Date,
                default: Date.now
            },
            type : {
                type : String,
                required : true
            },
        }]
    },
    // totalQty : {
    //     type : Number,
    //     required : true
    // }
})


const Cart = mongoose.model("Cart", cartSchema)

module.exports = Cart;



