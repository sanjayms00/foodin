require("dotenv").config()
const express = require("express")
const adminRoute = express.Router()
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")
const mongoDBSession = require("connect-mongodb-session")(session)

const multer = require("multer")
const storage = multer.memoryStorage();
const uploads = multer({storage})

const store = mongoDBSession({
    uri : process.env.DATABSE_URL,
    collection : "adminSessions"
})

//session middlware
adminRoute.use(session({
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    store : store
}))

//importing the controllers
const dashboardController = require("../../controller/admin/dashboardController")
const adminConfigController = require("../../controller/admin/adminConfigController")
const userController = require("../../controller/admin/userController")
const foodController = require("../../controller/admin/foodController")
const categoryController = require("../../controller/admin/categoryController")
const ordersController = require("../../controller/admin/ordersController")

const adminMiddleware = require("../../middleware/admin/adminMiddleware")

adminRoute.use(expressLayouts)

//authentication routes
adminRoute.get("/",adminConfigController.admin)
adminRoute.get("/login",adminConfigController.login)
adminRoute.post("/auth",adminConfigController.auth)
adminRoute.get("/auth",adminConfigController.login)
adminRoute.get("/logout",adminConfigController.logout)
//dashboard routes
adminRoute.get("/dashboard", adminMiddleware.adminSessionCheck, dashboardController.dashboard)
adminRoute.get("/sales-report", adminMiddleware.adminSessionCheck, dashboardController.showSalesDataGet)
adminRoute.get("/get-sale-data", adminMiddleware.adminSessionCheck, dashboardController.getSaleData)
//user routes
adminRoute.get("/users", adminMiddleware.adminSessionCheck, userController.showusers)
adminRoute.post("/userStatus", adminMiddleware.adminSessionCheck, userController.userStatus)
//food routes
adminRoute.get("/food", adminMiddleware.adminSessionCheck, foodController.showFood)
adminRoute.get("/createFood",adminMiddleware.adminSessionCheck, foodController.createFood)
adminRoute.post("/save-food", uploads.single('file_photo'), foodController.saveFood)
adminRoute.post("/updateFood", uploads.single('file_photo'), foodController.updateFood)
adminRoute.get("/editFood",adminMiddleware.adminSessionCheck, foodController.editFood)
adminRoute.get("/deleteFood",adminMiddleware.adminSessionCheck, foodController.deleteFood)
adminRoute.get("/foodStatus/:status", adminMiddleware.adminSessionCheck, foodController.foodStatus)

//category routes
adminRoute.get("/category", adminMiddleware.adminSessionCheck, categoryController.showCategory)
adminRoute.get("/createCategory",adminMiddleware.adminSessionCheck, categoryController.createCategory)
adminRoute.post("/saveCategory",adminMiddleware.adminSessionCheck, categoryController.saveCategory)
adminRoute.get("/editCategory",adminMiddleware.adminSessionCheck, categoryController.editCategory)
adminRoute.post("/updatecategory",adminMiddleware.adminSessionCheck, categoryController.updateCategory)
adminRoute.delete("/deleteCategory",adminMiddleware.adminSessionCheck, categoryController.deleteCategory)
adminRoute.post("/categoryStatus",adminMiddleware.adminSessionCheck, categoryController.categoryStatus)

//order routes
adminRoute.get("/orders", adminMiddleware.adminSessionCheck, ordersController.showOrders)
adminRoute.patch("/cancel-order", adminMiddleware.adminSessionCheck, ordersController.cancelOrder)
adminRoute.post("/change-status", adminMiddleware.adminSessionCheck, ordersController.changeStatus)

//export adminRoute
module.exports = adminRoute