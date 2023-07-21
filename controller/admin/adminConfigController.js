const AdminUsers = require("../../models/admin/adminModel")
const bcrypt = require("bcryptjs")
const admin = (req,res) => {
    try {
        res.redirect("/admin/login")
    } catch (error) {
        console.log(error.message)
    }
}

const login = (req,res) => {
    try {
        res.render("admin/adminlogin",{layout : false})
    } catch (error) {
        console.log(error.message)
    }
}
const auth = async(req,res) => {
    try {
        //logic
        const {adminEmail, adminPassword } = req.body 
        console.log(adminEmail, adminPassword)
        const checkAdmin = await AdminUsers.findOne({email : adminEmail})
        console.log(checkAdmin)
        if(!checkAdmin){
            console.log("user name or pass in correct");
            return res.render("admin/adminlogin", {layout : false})
        }
        const checkPassword = await bcrypt.compare(adminPassword, checkAdmin.password)
        if(!checkPassword){
            console.log("incorrect pass")
            return res.render("admin/adminlogin", {layout : false})
        }
        res.redirect("/admin/dashboard")
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    admin,
    login,
    auth
}