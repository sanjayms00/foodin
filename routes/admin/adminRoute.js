const express = require("express")
const adminRoute = express.Router()

//importing the controllers
const dashboardController = require("../../controller/admin/dashboardController")

adminRoute.get("/dashboard",dashboardController.dashboard)

//export adminRoute
module.exports = adminRoute