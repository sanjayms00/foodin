const Orders = require('../../models/admin/ordersModel')
const mongoose  = require('mongoose')
const orderHelper = require('../../helper/orderHelper')

//show current orders
const currentOrders = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = (await Orders.find({ user: userId, status : {$nin : ["canceled", "delivered"] }}).sort({time : -1}).populate('user').exec());
        res.render("public/currentOrders", {data : orders})
    } catch (error) {
        res.render("public/errorPage", {status : "error", msg : "Issue loading the page"})
    }
}

//canceled order page
const canceledOrders = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = await Orders.find({ user: userId, status : "canceled", paymentStatus : 'pending' }).sort({canceledTime : -1}).populate('user').exec();
        res.render("public/canceledOrders", {data : orders})
    } catch (error) {
        res.render("public/errorPage", {status : "error", msg : "Issue loading the page"})
    }
}

const orderHistory = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = (await Orders.find({user : userId, paymentStatus : 'recieved'}).sort({deliveredTime : -1}).populate('user').exec())
        res.render("public/orderHistory", {data : orders})
    } catch (error) {
        res.render("public/errorPage", {status : "error", msg : "Issue loading the page"})
    }
}


const cancelOrder = async (req, res) => {
    try {
        const orderId = new mongoose.Types.ObjectId(req.body.id)
        if(!orderId){
            return res.status(404).json({status : "error", msg : "order not Found"})
        }
        await orderHelper.cancelOrder(orderId)
        .then((response)=>{
            res.status(200).json({status : "success", msg : response})
        }) 
    } catch (error) {
        return res.status(400).json({status : "error", msg : error.message})
    }
}



module.exports = {
    currentOrders,
    orderHistory,
    canceledOrders,
    cancelOrder
}