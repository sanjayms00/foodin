const Orders = require('../../models/admin/ordersModel')
const mongoose  = require('mongoose')

const currentOrders = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = (await Orders.find({ user: userId, status : {$nin : ["canceled", "delivered"] }}).populate('user').exec());
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
        const orders = await Orders.find({ user: userId, status : "canceled", paymentStatus : 'pending' }).populate('user').exec();
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
        const orders = await Orders.find({user : userId, paymentStatus : 'recieved'}).populate('user').exec();
        res.render("public/orderHistory", {data : orders})
    } catch (error) {
        res.render("public/errorPage", {status : "error", msg : "Issue loading the page"})
    }
}


const cancelOrder = async (req, res) => {
    try {
        // console.log(req.body.id)
        const orderId = new mongoose.Types.ObjectId(req.body.id)
        if(!orderId){
            return res.status(404).json({status : "error", msg : "order not Found"})
        }
        const cancelOrder = await Orders.updateOne({_id : orderId}, {$set : {status : 'canceled'}})
        if(!cancelOrder){
            return res.status(400).json({status : "error", msg : "order Cancel failed"})
        }
        res.status(200).json({status : "success", msg : "Order Canceled"})
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