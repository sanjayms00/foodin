
require("dotenv").config()
const Users = require("../../models/public/userModel")
const Category = require("../../models/admin/categoryModel")
const bcrypt = require("bcryptjs")
const crypto = require('crypto');
const accountSid = 'AC9a4ee74013947f7bdf79a01bbd9a642a';
const authToken = '5b354d9f48186cd7021d3affcc1aff9b';
const twilioNumber = "+12292673022"
const client = require('twilio')(accountSid, authToken);

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
const loginAuthenticate = async (req, res) => {
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
            if(checkUser.blocked === true){
                return res.status(401).render("public/login",{status : "error", msg : "User is temporarily blocked. Contact the web site owner for assistance"}) 
            }
            const checkPassword = await bcrypt.compare(loginPassword, checkUser.password)
            if(!checkPassword){
                return res.status(401).render("public/login",{status : "error", msg : "username and password is incorrect"})
            }
            req.session.isloggedIn = true
            
            res.render("public/ShowNumber")
            
        }
    } catch (error) {
        console.log(error.message)
    }
}

function generateOTP() {
    try {
        const digits = '0123456789';
            let otp = '';
            for (let i = 0; i < 6; i++) {
                const index = crypto.randomInt(0, digits.length);
                otp += digits[index];
            }
            return otp;
    } 
    catch (error) {
        console.log(error.message)
    }
  
}

const verifyOtp = (req, res) => {
    try {
        const mobileNumber = req.query.userMobileNumber;
        res.render("public/otpPage", {mobile : mobileNumber})
    } catch (error) {
        console.log(error.message)
    }
}

const validateOtp = async (req, res) => {
    try {
        const { otp , mobileNumber } = req.body;
        console.log(otp, mobileNumber)
        const getUserOtp = await Users.findOne({phone : mobileNumber})
        if(!getUserOtp){
            res.json({status : "error", msg : "unauthorozed User"})
        }
        bcrypt.compare(otp, getUserOtp.tempSecret, (err, isMatch)=>{
            if(err){
                res.json({status : "error", msg : "Wrong OTP"})
            }else if(isMatch){
                req.session.isauth = true;
                req.session.userName = getUserOtp.firstName;
                res.json({status : "success", msg : "OTP Verified"})
            }else{
                res.json({status : "error", msg : "OTP is incorrect. Login failed"})
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}

const validateNumber = async (req, res) => {
    try {
        const { mobileNumber } = req.body
        const userData = await Users.findOne({phone : mobileNumber})
        if(!userData){
            res.json({status : "error", msg : "Wrong Mobile Number"})
        }else{
            console.log("success verified mobile number")
            const otp = generateOTP();
            console.log('Generated OTP:', otp);
            console.log(userData.phone)
            const sendOtp = client.messages
                            .create({
                                body: `foodin otp to verify mobile Number, Enter the otp and verify your account - ${otp}`,
                                to: `+91${userData.phone}`,
                                from: "+12292673022", 
                            })
            if(!sendOtp){
                res.json({status : "error", msg : "can not sent OTP at the moment"})
            }
            const hashOtp = await bcrypt.hash(otp, 12)
            const updateStatus = await Users.updateOne({phone : mobileNumber}, {$set : {tempSecret : hashOtp}})
            if(!updateStatus){
                res.json({status : "error", msg : "can not move on , some issue occured"})
            }
            res.json({status : "success", msg : "mobile number verified"})
        }
    } catch (error) {
        res.json({status : "error", msg : error.message})
    }
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
    signupAuthenticate,
    logOut,
    verifyOtp,
    validateOtp,
    validateNumber
}