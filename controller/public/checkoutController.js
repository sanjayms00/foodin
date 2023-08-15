
const mongoose = require('mongoose')
const Users = require("../../models/public/userModel")
const Cart = require("../../models/public/cartModel");
const Orders = require("../../models/admin/ordersModel")
const PaymentHelper = require("../../helper/paymentHelper")




//find cart Total
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

//find cart items
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

//find deafault adderss
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
        if(cartItems.length < 1){
          res.render("public/errorPage", {status : "eroor", msg : "No items in the Cart"})
        }else if(cartTotal < 1){
          res.render("public/errorPage", {status : "eroor", msg : "No items in the Cart"})
        }
        
        res.render("public/checkOut", {subTotal : cartTotal, user, cartItems, defAddress})
    } catch (error) {
      res.render("public/errorPage", {status : "eroor", msg : "No items in the Cart"})
    }
    
}

const authCheckout = async (req,res)=>{
    
    try {
      const userId = new mongoose.Types.ObjectId(req.session.isauth);
      // console.log(req.body)
      let { address, cartItems, price, totalPrice, paymentOption } = req.body
      
      if(!cartItems.length){
        return res.status(400).json({status : "eroor", msg : "No items in the Cart"})
      }
      if(!address){
        return res.status(404).json({status : "eroor", msg : "Address Not Found"})
      }
      cartItems = JSON.parse(cartItems)
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
        if(paymentOption === 'cod'){
          return res.status(200).json({status : "success", msg : "Order Placed", paymentMethod : paymentOption })
        }else if(paymentOption === 'onlinePay')
        {
          const razorpayOrder = await PaymentHelper.generateRazorPay(orderResult._id, price)
          console.log(razorpayOrder)
          return res.status(200).json({status : "success", msg : "Order Placed", paymentMethod : paymentOption, razorpayOrder  })
        }else
        {
          return res.status(500).json({status : "eroor", msg : "Invalid Payment Option"})
        }
      }else{
        return res.status(500).json({status : "eroor", msg : "Cannot place Order"})
      }
    } catch (error) {
      return res.status(500).json({status : "eroor", msg : error.message})
    }
    // let { cartItems, defAddressId } = req.body 
    // cartItems = json.parse(cartItems);
  
    // console.log(req.body.length, userId)


    // if(!req.body.length > 0){
    //     return res.status(400).json({status : "error", msg : "No foods are added to cart"})
    // }
    
    // res.status(200).json({status : "success", msg : "success"})
}


//payment verificatiion
const verifyPayment = async (req,res) => {
    try {
        const {response, order} = req.body
        await PaymentHelper.verifyRazorPayPayment(response, order)
        .then(async (result)=>{
        
          await Orders.updateOne(
                  {_id : new mongoose.Types.ObjectId(order.razorpayOrder.receipt)},
                  {$set : {paymentStatus : "recieved"}})
                  .then((updateResponse)=>{
                    res.status(200).json({status : "success", msg : "Payment successfull"})
                  })
                  .catch((err)=>{
                    res.status(500).json({status : "error", msg : "failed to upload the order status"})
                  })
        })
        .catch((err)=>{
          res.status(500).json({status : "error", msg : err.message})
        })
    } catch (error) {
      res.status(500).json({status : "error", msg : error.message})
    }
}


const success = (req, res) =>{
  res.render("public/orderPlaced")
}

const failed = (req, res) =>{
  res.render("public/errorPage", {status : 'error', msg : "Payment Failed"})
}


module.exports = {
    checkout,
    verifyPayment,
    authCheckout,
    success,
    failed
}