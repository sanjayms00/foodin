require("dotenv").config()
const express = require("express");
const publicRoute = express.Router()
const session = require("express-session")
const mongoDBSession = require("connect-mongodb-session")(session)

const store = mongoDBSession({
    uri : process.env.DATABSE_URL,
    collection : "userSessions"
})

// publicRoute.use((req, res, next) => {
//     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
//     res.setHeader('Pragma', 'no-cache');
//     res.setHeader('Expires', '0');
//     res.setHeader('Surrogate-Control', 'no-store');
//     next();
//   });

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
const foodController = require("../../controller/public/foodController");
const profileController = require("../../controller/public/profileController")
const addressController = require("../../controller/public/addressController")
const orderController = require("../../controller/public/orderController")

//include middleware
const userMiddleWare = require("../../middleware/public/userMiddleware")

publicRoute.use(userMiddleWare.sessionCheck)

//home route
publicRoute.get("/",homeController.home)
//config routes
publicRoute.get("/login",userMiddleWare.isloggedIn, configController.login)
publicRoute.post("/loginAuthenticate",configController.loginAuthenticate)
publicRoute.get("/loginAuthenticate",userMiddleWare.isloggedIn, configController.login)
publicRoute.get("/signup",userMiddleWare.isloggedIn, configController.signup)
publicRoute.post("/signupAuthenticate", configController.signupAuthenticate)
publicRoute.get("/forgotPassword",userMiddleWare.isloggedIn, configController.forgotPassword)
publicRoute.get("/logout", configController.logOut)

//2fa varification
publicRoute.get("/verifyOtp",userMiddleWare.isloggedIn, configController.verifyOtp)
publicRoute.post("/validateOtp", userMiddleWare.isloggedIn, configController.validateOtp)
publicRoute.post("/validateNUmber", userMiddleWare.isloggedIn, configController.validateNumber)

//food routes
publicRoute.get("/foodDetail/:slug", foodController.detail)

//profile Routes
publicRoute.get("/my-profile", profileController.myProfile)
publicRoute.get("/edit-profile", profileController.editProfile)
publicRoute.get("/address-book", addressController.addressBook)
publicRoute.get("/orders", orderController.currentOrders)
publicRoute.get("/order-history", orderController.orderHistory)
publicRoute.get("/track-order", addressController.trackOrder)





//export publicRoute
module.exports = publicRoute;