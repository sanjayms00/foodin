require('dotenv').config()
const express = require("express")
const app = express();
const PORT = process.env.PORT || 3001;

const publicRoute = require("./routes/public/publicRoute")
const adminRoute  = require("./routes/admin/adminRoute")

app.use("/",publicRoute);
app.use("/admin",adminRoute)


// page not found
app.use("*",(req,res,next)=>{
    res.status(404).send("page not found")
})

app.listen(PORT,()=>{
    console.log(`foodin is running : http://127.0.0.1:${PORT}`)
})