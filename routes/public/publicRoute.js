const express = require("express");
const publicRoute = express.Router()

// get controllers
const homeController = require("../../controller/public/homeController")
const configController = require("../../controller/public/configController")

//handle 404


//routes
publicRoute.get("/",homeController.home)
publicRoute.get("/login",configController.login)
publicRoute.get("/signup",configController.signup)

//export publicRoute
module.exports = publicRoute;