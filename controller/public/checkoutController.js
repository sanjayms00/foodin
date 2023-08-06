const mongoose = require('mongoose')
const Users = require("../../models/public/userModel")
const Cart = require("../../models/public/cartModel");
const Orders = require("../../models/admin/ordersModel")

async function getcartTotal(userId){
  const cart = await Cart.aggregate([
    {
      $match: { userId: userId }
    },
    {
      $unwind: "$items"
    },
    {
      $lookup: {
        from: "foods",
        localField: "items.foodId",
        foreignField: "_id",
        as: "carted"
      }
    },
    {
      $project: {
        item: "$items.foodId",
        quantity: "$items.quantity",
        total: "$items.total",
        carted: { $arrayElemAt: ["$carted", 0] }
      }
    },
    {
      $group: {
        _id : null,
        subTotal: { $sum: { $multiply: ["$quantity", "$carted.discPrice"] } }
      }
    }
  ]);
  return cart
}
async function getcartItems(userId){
  const cart = await Cart.aggregate([
    {
      $match: { userId: userId }
    },
    {
      $unwind: "$items"
    },
    {
      $lookup: {
        from: "foods",
        localField: "items.foodId",
        foreignField: "_id",
        as: "carted"
      }
    },
    {
      $project: {
        item: "$items.foodId",
        quantity: "$items.quantity",
        total: "$items.total",
        carted: { $arrayElemAt: ["$carted", 0] }
      }
    }
  ]);
  return cart
}

async function getDefAddress(addressId, userId){
  try{
    const address = await Users.aggregate([
      {$match : {_id : userId }},
      {$unwind : '$addresses'},
      {$match : {"addresses._id" : addressId}},
      {$project : {addresses : 1}}
  ])
  return address[0].addresses
  }catch(err){
    return err.message
  }
}

//load checkout page
const checkout = async (req,res)=>{
    try {
        const userId = new mongoose.Types.ObjectId(req.session.isauth);
        if(!userId){
            return
        }
        const user = await Users.findOne({_id : userId})
        const cartTotal = await getcartTotal(userId)
        const cartItems = await getcartItems(userId)
        const defAddress = await getDefAddress(user.defaultAddress, userId) 

        console.log(cartItems)


        res.render("public/checkOut", {subTotal : cartTotal, user, cartItems, defAddress})
    } catch (error) {
        console.log(error.message)
    }
    
}

const authCheckout = async (req,res)=>{
    const userId = new mongoose.Types.ObjectId(req.session.isauth);
    // console.log(req.body)
    let { address, cartItems, price, totalPrice, paymentOption } = req.body
    cartItems = JSON.parse(cartItems)
    if(paymentOption === 'cod'){
      const orderData = new Orders({
        items : cartItems,
        user : userId,
        address : address,
        time : new Date(),
        status : "placed",
        subTotal : price,
        paymentStatus : "pending",
        paymentMethod : paymentOption
      });

      const orderResult = await orderData.save()
      if(orderResult){
        await Cart.deleteOne({userId })
        // console.log(true)
        res.render("public/ordePlaced")
      }else{
        // console.log(false)
      }
      
    }else{
      res.redirect("/payment")
    }
    // let { cartItems, defAddressId } = req.body 
    // cartItems = JSON.parse(cartItems);
  
    // console.log(req.body.length, userId)


    // if(!req.body.length > 0){
    //     return res.status(400).json({status : "error", msg : "No foods are added to cart"})
    // }
    
    // res.status(200).json({status : "success", msg : "success"})
}

const payment = (req,res)=>{
    console.log("here")
    res.render("public/paymentMethods")
}

module.exports = {
    checkout,
    payment,
    authCheckout
}