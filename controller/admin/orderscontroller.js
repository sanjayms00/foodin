const Orders = require("../../models/admin/ordersModel")
const orderHelper = require('../../helper/orderHelper')
const mongoose = require("mongoose")

const showOrders = async (req,res)=>{
    try {
        const orders = (await Orders.find({}).populate('user').sort({_id : -1})
        .exec());
        // console.log(JSON.stringify(orders[0].items));
        res.status(200).render("admin/orders/index", {data : orders})
    } catch (error) {
        console.log(error.message)
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

const changeStatus = async (req, res) => {
    try {
        // console.log(req.body.id)
        const orderId = new mongoose.Types.ObjectId(req.body.id)
        const status = req.body.status
        if(!orderId){
            return res.status(404).json({status : "error", msg : "order not Found"})
        }
        if(status === "delivered"){
            console.log("deliverd")
            var updateStatus = await Orders.updateOne({_id : orderId}, {$set : {status : status, paymentStatus : 'recieved', deliveredTime : new Date()}})
        }else{
            var updateStatus = await Orders.updateOne({_id : orderId}, {$set : {status : status}})
        }
        if(!updateStatus){
            return res.status(400).json({status : "error", msg : "can't change status"})
        }
        res.status(200).json({status : "success", msg : "Status Chanaged", value : status})
    } catch (error) {
        return res.status(400).json({status : "error", msg : error.message})
    }
}





//export all functions like objects
module.exports = {
    showOrders,
    cancelOrder,
    changeStatus
    

}