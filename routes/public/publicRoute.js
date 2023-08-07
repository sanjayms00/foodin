require("dotenv").config()
const express = require("express");
const publicRoute = express.Router()
const session = require("express-session")
const mongoDBSession = require("connect-mongodb-session")(session)

const store = mongoDBSession({
    uri : process.env.DATABSE_URL,
    collection : "userSessions"
})

publicRoute.use(express.json())

//session middlware
publicRoute.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    store : store,
    //cookie : {maxAge : 1000 * 60 * 60 * 24} //24 hours life
}))

// get controllers
const homeController = require("../../controller/public/homeController")
const configController = require("../../controller/public/configController");
const foodController = require("../../controller/public/foodController");
const profileController = require("../../controller/public/profileController")
const addressController = require("../../controller/public/addressController")
const orderController = require("../../controller/public/orderController")
const cartController = require("../../controller/public/cartContoller")
const checkoutController = require("../../controller/public/checkoutController")

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
publicRoute.get("/logout", configController.logOut)
publicRoute.get("/forgot-password",userMiddleWare.isloggedIn, configController.forgotPassword)
publicRoute.post("/forgot-password",userMiddleWare.isloggedIn, configController.forgotPasswordAuth)
publicRoute.get("/reset-password/:id/:token",userMiddleWare.isloggedIn, configController.resetPassword)
publicRoute.post("/reset-password",userMiddleWare.isloggedIn, configController.resetPasswordAuth)

//2fa varification
publicRoute.get("/verifyOtp",userMiddleWare.isloggedIn, configController.verifyOtp)
publicRoute.post("/validateOtp", userMiddleWare.isloggedIn, configController.validateOtp)
publicRoute.post("/validateNUmber", userMiddleWare.isloggedIn, configController.validateNumber)

//food routes
publicRoute.get("/foodDetail/:slug", foodController.detail)

//profile Routes
publicRoute.get("/my-profile", userMiddleWare.isBlocked,  profileController.myProfile)
publicRoute.get("/edit-profile", userMiddleWare.isBlocked, profileController.editProfile)
publicRoute.post("/update-profile", userMiddleWare.isBlocked, profileController.updateProfile)

//address routes
publicRoute.get("/address-book", userMiddleWare.isBlocked, addressController.addressBook)
publicRoute.get("/edit-address/:id", userMiddleWare.isBlocked, addressController.editAddress)
publicRoute.post("/delete-address", userMiddleWare.isBlocked, addressController.deleteAddress)
publicRoute.post("/save-address", userMiddleWare.isBlocked, addressController.saveAddress)
publicRoute.patch("/update-address", userMiddleWare.isBlocked, addressController.updateAddress)
publicRoute.patch("/set-default", userMiddleWare.isBlocked, addressController.setDefault)
publicRoute.put("/update-address", userMiddleWare.isBlocked, addressController.updateAddress)

// order routes
publicRoute.get("/orders", userMiddleWare.isBlocked, orderController.currentOrders)
publicRoute.get("/order-history", userMiddleWare.isBlocked, orderController.orderHistory)
publicRoute.get("/canceled-orders", userMiddleWare.isBlocked, orderController.canceledOrders)
publicRoute.get("/track-order", userMiddleWare.isBlocked, addressController.trackOrder)

//cart routes
publicRoute.post("/add-to-cart", userMiddleWare.isBlocked, cartController.addToCart)
publicRoute.post("/delete-cart-item", userMiddleWare.isBlocked, cartController.deleteCartItem)
publicRoute.get("/cart", userMiddleWare.isBlocked, cartController.showCart)
publicRoute.patch("/update-cart-data", userMiddleWare.isBlocked, cartController.updateCartByQuantity)


//checkout Routes
publicRoute.get("/checkout",userMiddleWare.isBlocked, checkoutController.checkout)
publicRoute.post("/authCheckout",userMiddleWare.isBlocked,  checkoutController.authCheckout)
publicRoute.get("/payment",userMiddleWare.isBlocked, checkoutController.payment)


//export publicRoute
module.exports = publicRoute;