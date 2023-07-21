require("dotenv").config()
const express = require("express");
const publicRoute = express.Router()
const session = require("express-session")
const mongoDBSession = require("connect-mongodb-session")(session)

const store = mongoDBSession({
    uri : process.env.DATABSE_URL,
    collection : "userSessions"
})

//session middlware
publicRoute.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    store : store
}))

// get controllers
const homeController = require("../../controller/public/homeController")
const configController = require("../../controller/public/configController");

//routes
publicRoute.get("/",homeController.home)
publicRoute.get("/login",configController.login)
publicRoute.post("/loginAuthenticate",configController.loginAuthenticate)
publicRoute.get("/signup",configController.signup)
publicRoute.post("/signupAuthenticate",configController.signupAuthenticate)
publicRoute.get("/forgotPassword",configController.forgotPassword)


//export publicRoute
module.exports = publicRoute;