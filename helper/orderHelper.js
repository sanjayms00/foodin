const Users = require("../models/public/userModel")
const Orders = require("../models/admin/ordersModel")
const Cart = require('../models/public/cartModel')
const mongoose = require('mongoose')



//cancel order and refund for online payment
const cancelOrder = (orderId) =>{
    return new Promise((resolve, reject)=>{
        const cancelOrder = Orders.updateOne({_id : orderId}, {$set : {status : 'canceled', canceledTime : new Date()}})
        const findOrder = Orders.findOne({_id : orderId})
        Promise.all([cancelOrder, findOrder])
        .then(async (values) => {
            const subTotal = values[1].subTotal
            //console.log('subtotal:',subTotal)
            //take wallet amount if exist
            let walletAmount = 0
            if(values[1].walletAmount){
                walletAmount = values[1].walletAmount
            }
            //console.log('wallet amount :', walletAmount)
            const user = values[1].user
            if(values[1].paymentMethod === 'onlinePay'){
                const totalRefund = subTotal + walletAmount
                //console.log('total : ', totalRefund)
                await Users.updateOne({_id : user}, {$inc : {'wallet.balance' : totalRefund}})
                .then((response)=>{
                    resolve('Order Canceled, and Amount Refund Started')
                })
            }else if(values[1].paymentMethod === 'wallet'){
                const totalRefund = subTotal + walletAmount
                console.log('total : ', totalRefund)
                await Users.updateOne({_id : user}, {$inc : {'wallet.balance' : totalRefund}})
                .then((response)=>{
                    resolve('Order Canceled, and Amount Refund Started')
                })
                resolve('Order Canceled Refund Started')
            }
        }).catch((err)=>{
            
            reject(err)
        })
    })
}

const makeOrder = (data) => {
    totalPrice = parseInt(data.totalPrice)
    let paymentStatus = 'pending'
    if(totalPrice === 0 && data.paymentOption === 'wallet'){
        paymentStatus = 'recieved'
    }
    return new Promise(async (resolve, reject)=>{
        const orderDetails = {
            items : data.cartItems,
            user : data.userId,
            address : data.address,
            time : new Date(),
            status : "placed",
            subTotal : data.totalPrice,
            paymentStatus : paymentStatus,
            paymentMethod : data.paymentOption,
            walletAmount : 0
          }
          if(data.walletAmount){
            orderDetails.walletAmount = data.walletAmount
          }
        const orderData = new Orders(orderDetails);
    
        await orderData.save()
        .then((response)=>{
            resolve(response)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}

const emptyCart = (userId) => {
    return new Promise(async (resolve, reject)=>{
        await Cart.deleteOne({userId})
        .then((response)=>{
            resolve(response)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}


const updateWallet = (userId, walletAmount) => {
    return new Promise(async (resolve, reject)=>{
        await Users.updateOne({_id : new mongoose.Types.ObjectId(userId)}, 
                    {$inc : {'wallet.balance' : -walletAmount}}, 
                    {$set : {'lastUpdated' : new Date()}
                })
        .then((response)=>{
            resolve(response)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}





module.exports = {
    cancelOrder,
    makeOrder,
    emptyCart,
    updateWallet
}