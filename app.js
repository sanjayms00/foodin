require('dotenv').config()
const express = require("express")
const app = express();

//connect to database
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABSE_URL,{useNewUrlParser : true,  useUnifiedTopology : true})
.then(()=>{
    console.log("mongodb connected")
}).catch((err)=>{
    console.log(err)
})

//get port from environment variables
const PORT = process.env.PORT || 3001;
const path = require("path")

//view engine, views settinng
app.set('view engine', "ejs");
app.set("views","./views")
app.set('layout', 'admin/layout');

//serve static files
app.use(express.static("views/public"))
app.use(express.static("views/admin"))

//public and admin routes
const publicRoute = require("./routes/public/publicRoute")
const adminRoute  = require("./routes/admin/adminRoute")
app.use(express.urlencoded({extended : true}))
app.use(express.json())

app.use("/",publicRoute);
app.use("/admin",adminRoute)

// handle 404 page not found
app.use("*",(req,res,next)=>{
    res.status(404).send("page not found")
})

app.listen(PORT,()=>{
    console.log(`foodin is running : http://127.0.0.1:${PORT}`)
})