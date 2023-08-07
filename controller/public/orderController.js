const Orders = require('../../models/admin/ordersModel')
const mongoose  = require('mongoose')

const currentOrders = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = await Orders.find({ user: userId, paymentStatus: 'pending', status : {$ne : "canceled" }}).populate('user').exec();
        res.render("public/currentOrders", {data : orders})
    } catch (error) {
        res.render("public/errorPage", {status : "error", msg : "Issue loading the page"})
    }
}

const canceledOrders = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.render("public/errorPage", {status : "error", msg : "user not found"})
        }
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        const orders = await Orders.find({ user: userId, status : "canceled" }).populate('user').exec();
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


module.exports = {
    currentOrders,
    orderHistory,
    canceledOrders
}