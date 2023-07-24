const Users = require("../../models/public/userModel")

const showusers = async (req,res)=>{
    try {
        const userData = await Users.find({})
        res.status(200).render("admin/users", {data : userData})
    } catch (error) {
        console.log(error.message)
    }
}
const userStatus = async (req,res)=>{
    try {
        const userStatus = req.params.status
        const userStat = userStatus.split("-")
        const [userId, status] = userStat
        const updateStatus = await Users.updateOne({_id : userId}, {$set : {blocked : status === "true"}})
        console.log(updateStatus)
        const userData = await Users.find({})
        if(!updateStatus){
            return res.status(400).render("admin/users", {data : userData, status : "error", msg : "Status Updation Failed"})
        }
        res.status(200).render("admin/users", {data : userData, status : "success", msg : "Status Updated"})
    } catch (error) {
        console.log(error.message)
    }
}

//export all functions like objects
module.exports = {
    showusers,
    userStatus
}