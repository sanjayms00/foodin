const express = require("express")
const adminRoute = express.Router()
const expressLayouts = require("express-ejs-layouts")
//importing the controllers
const dashboardController = require("../../controller/admin/dashboardController")
const adminConfigController = require("../../controller/admin/adminConfigController")
const userController = require("../../controller/admin/userController")
const foodController = require("../../controller/admin/foodController")

adminRoute.use(expressLayouts)

//authentication routes
adminRoute.get("/",adminConfigController.admin)
adminRoute.get("/login",adminConfigController.login)
adminRoute.post("/auth",adminConfigController.auth)
//dashboard routes
adminRoute.get("/dashboard",dashboardController.dashboard)
//user routes
adminRoute.get("/users",userController.showusers)
//food routes
adminRoute.get("/food",foodController.showFood)
adminRoute.get("/createFood",foodController.createFood)
// adminRoute.get("/updateFood",foodController.UpdateFood)
// adminRoute.get("/deleteFood",foodController.deletefood)

//export adminRoute
module.exports = adminRoute