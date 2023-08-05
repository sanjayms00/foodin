const checkout = (req,res)=>{
    res.render("public/checkOut")
}

const authCheckout = (req,res)=>{
    if(!req.body.length > 0){
        return res.status(400).json({status : error, msg : "No foods are added to cart"})
    }
    
    res.status(200).json({status : "success", msg : "success"})
}

const payment = (req,res)=>{
    console.log("here")
    res.render("public/paymentMethods")
}

module.exports = {
    checkout,
    payment,
    authCheckout
}