const Users = require("../../models/public/userModel")

const showusers = async (req,res)=>{
    try {
        const userData = await Users.find({})
        res.status(200).render("admin/users", {data : userData})
    } catch (error) {
        console.log(error.message)
    }
}

//export all functions like objects
module.exports = {
    showusers
}