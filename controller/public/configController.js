const Users = require("../../models/public/userModel")
const Category = require("../../models/admin/categoryModel")
const bcrypt = require("bcryptjs")
const axios = require("axios")
const qrcode = require("qrcode")
const {authenticator} = require("otplib")

//login
const login = async (req, res) => {
    try {
        const categoryData = await Category.find({})
        res.render("public/login", {categories : categoryData})
    } catch (error) {
        console.log(error.message)
    }
}

//login authenticate
const loginAuthenticate = async(req, res) => {
    try {
        const { emailId, loginPassword } = req.body
        //validate all fields
        if (!emailId) {
            return res.status(400).render("public/login", {status : "error", msg : "Email Id Required"});
        } 
        else if(!loginPassword){
            return res.status(400).render("public/login", {status : "error", msg : "Password Required"});
        }
        else 
        {
            const checkUser = await Users.findOne({email : emailId})
            if(!checkUser){
                return res.status(401).render("public/login",{status : "error", msg : "username and password is incorrect"})
            }
            const checkPassword = await bcrypt.compare(loginPassword, checkUser.password)
            if(!checkPassword){
                return res.status(401).render("public/login",{status : "error", msg : "username and password is incorrect"})
            }
            req.session.isloggedIn = true
            res.redirect(`/verifyuser?id=${checkUser._id}`)
            // // show otp verify page
            // res.status(200).render("public/totpVerification",{status : "success", msg : "verify OTP"})
            // res.status(200).render("public/login",{status : "success", msg : "Login Successfull"})
        }
    } catch (error) {
        console.log(error.message)
    }
}

const verifyuser = async (req,res)=>{
        //post request
        try {
            const userId = req.query.id
            const checkUser = await Users.findOne({_id : userId})
            if(!checkUser){
                return res.redirect("/login")
            }
            axios.post('http://127.0.0.1:3000/totp-secret', {userId : userId})
            .then((response) => {
                // Handle the response from the API
                res.render("public/totpVerification",{image : response.data.image, status : response.data.success, userId :userId})
            })
            .catch((error) => {
                // Handle errors
                res.redirect("/login")
            }); 
        } catch (error) {
            console.log(error.message)
        }
        
}

//create secret key
const qrimage = async (req,res, next)=>{
    //secret key creation
    const {userId} = req.body
    const secret = authenticator.generateSecret()
    const uri = authenticator.keyuri(userId, "foodin", secret)
    const image = await qrcode.toDataURL(uri)
    //store temp secret in db
    const tempSecretSave = await Users.updateOne({_id : userId},{$set : {tempSecret : secret}})
    res.send({success : true, image})
}


const validateOtp = async (req,res,next)=>{
    try {
        const { otp, userId } = req.body;

        const userData = await Users.findOne({_id : userId})
        if(!userData){
            return res.redirect(`/verifyuser?id=${userId}`)
        }
        const {tempSecret} = userData

        const verified = authenticator.check(otp, tempSecret)
        if(!verified){
            console.log("not varified")
            return res.redirect(`/verifyuser?id=${userId}`)
        }
        //update db is verified true
        const result = await Users.updateOne({_id : userId}, {$set : {isVarified : true}})
        if(!result){
            console.log("validation failed")
        }
        req.session.isauth = true
        req.session.userName = userData.firstName
        req.session.isloggedIn = false
        res.redirect("/")
        //end
    } catch (error) {
        console.log(error.message)
    }
    // res.send({
    //     "token" : speakeasy.totp({
    //         secret : req.body.secret,
    //         encoding : "base32"
    //     })
    // })
}

//fogot password authenticate
const forgotPassword = (req, res) => {
    try {
        res.send("forgot pass")
    } catch (error) {
        console.log(error.message)
    }
}

//signup 
const signup = async (req, res) => {
    try {
        const categoryData = await Category.find({})
        res.render("public/signup", {categories : categoryData})
    } catch (error) {
        console.log(error.message)
    }
}

//signup authenticate
const signupAuthenticate = async (req, res) => {
    try {
        const { firstName, lastName, emailId, mobileNumber, signupPassword, confirmPassword } = req.body
        //validate all fields
        if (!firstName) {
            return res.status(400).render("public/signup", {status : "error", msg : "first name Required"});
        } 
        else if(!lastName){
            return res.status(400).render("public/signup", {status : "error", msg : "Last name Required"});
        }
        else if(!emailId){
            return res.status(400).render("public/signup", {status : "error", msg : "Email Required"});
        }
        else if(!mobileNumber){
            return res.status(400).render("public/signup", {status : "error", msg : "Mobile Number Required"});
        }
        else if(!signupPassword){
            return res.status(400).render("public/signup", {status : "error", msg : "Password Required"});
        }
        else if(!confirmPassword){
            return res.status(400).render("public/signup", {status : "error", msg : "Confirm Password Required"});
        }
        else 
        {
            const checkUser = await Users.findOne({email : emailId})
            if(checkUser){
                return res.status(409).render("public/signup", { status : "error", msg : "User already exist, login to your account" });
            }else{
                if (signupPassword === confirmPassword) {
                    const strongPassword = await bcrypt.hash(signupPassword, 12)
                    const newUser = new Users({
                        firstName: firstName,
                        lastName: lastName,
                        email: emailId,
                        phone: mobileNumber,
                        password: strongPassword,
                        isVarified: false,
                        blocked : false
                    })
                    await newUser.save()
                    .then(() => {
                        // req.session.isAuth = true
                        res.status(200).render("public/signup", {status : "success", msg : "Registation SuccessFull"})
                    }).catch((err) => {
                        console.log(err.message)
                        res.status(500).render("public/signup", {status : "error", msg : "Can't resgister at the moment"})
                    })
                } else {
                    return res.status(400).render("public/signup", {status : "error", msg : "Password does not match"});
                }
            }
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).render("public/signup", {status : "error", msg : "internal server error"})
    }
}

const logOut = (req,res)=>{
    try {
        req.session.destroy((err)=>{
            if(err){
                console.log(err.message)
            }else{
                res.redirect("/")
            }
        })
        
    } catch (error) {
        console.log(error.message)
    }
}




//export all functions like objects
module.exports = {
    login,
    loginAuthenticate,
    forgotPassword,
    signup,
    qrimage,
    verifyuser,
    signupAuthenticate,
    validateOtp,
    logOut
}