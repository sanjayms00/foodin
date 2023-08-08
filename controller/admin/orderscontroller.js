const Orders = require("../../models/admin/ordersModel")
const mongoose = require("mongoose")

const showOrders = async (req,res)=>{
    try {
        const orders = (await Orders.find({}).populate('user').sort({_id : -1}).exec());
        // console.log(JSON.stringify(orders[0].items));
        res.status(200).render("admin/orders/index", {data : orders})
    } catch (error) {
        console.log(error.message)
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

const changeStatus = async (req, res) => {
    try {
        // console.log(req.body.id)
        const orderId = new mongoose.Types.ObjectId(req.body.id)
        const status = req.body.status
        if(!orderId){
            return res.status(404).json({status : "error", msg : "order not Found"})
        }
        if(status === "delivered"){
            var updateStatus = await Orders.updateOne({_id : orderId}, {$set : {status : status, paymentStatus : 'recieved'}})
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




// const createCategory = async (req,res)=>{
//     try {
//         res.status(200).render("admin/category/create")
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const editCategory = async (req,res)=>{
//     try {
//         const getCategoryData = await Category.findOne({_id : req.query.id})
//         if(!getCategoryData){
//             return res.status(404).render("admin/category/index", {status : "error",  msg :  "Unable to edit the category" })
//         }
//         res.status(200).render("admin/category/edit", {category : getCategoryData})
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const updateCategory = async (req,res)=>{
//     try {
//         const{categoryId, updateCategoryName} = req.body
//         if(!categoryId || !updateCategoryName){
//             return res.status(400).render("admin/category/edit", {status : "error", msg : "fill all fields"})
//         }
//         const categoryUpdateResult = await Category.updateOne({_id : categoryId},{$set : {categoryName : updateCategoryName}})
//         if(!categoryUpdateResult){
//             return res.status(400).render("admin/category/edit")
//         }
//         res.status(200).render("admin/category/edit", {status : "success",  msg :  "category updated" })
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const deleteCategory = async (req,res)=>{
//     try {
//         const deleteCategoryData = await Category.deleteOne({_id : req.query.id})
//         if(!deleteCategoryData){
//             return res.status(400).redirect("admin/category")
//         }
//         res.status(200).redirect("/admin/category")
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const saveCategory = async (req,res)=>{
//     try {
//         const {categoryName} = req.body
//         console.log(categoryName)
//         if(!categoryName){
//             return res.status(400).render("admin/category/create", {status : "error", msg : "fill all fields"})
//         }
//         const newCategory = new Category({
//             categoryName: categoryName,
//             status : true
//         })
//         const saveData = await newCategory.save()
//         if(!saveData){
//             return res.status(500).render("admin/category/create", {status : "error", msg : "Category insertion failed"})
//         }
//         res.status(200).render("admin/category/create", {status : "success",  msg :  "category created" })
//     } catch (error) {
//         console.log(error.message)
//     }
// }

//export all functions like objects
module.exports = {
    showOrders,
    cancelOrder,
    changeStatus
    // createCategory,
    // saveCategory,
    // editCategory,
    // updateCategory,
    // deleteCategory

}