const Users = require("../../models/public/userModel")
const bcrypt = require("bcryptjs")
//login
const login = (req, res) => {
    try {
        res.render("public/login")
    } catch (error) {
        console.log(error.message)
    }
}

//login authenticate
const loginAuthenticate = async(req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body
        const checkUser = await Users.findOne({email : loginEmail})
        if(!checkUser){
            return res.status(401).render("public/login",{status : "username and password is incorrect"})
        }
        const checkPassword = await bcrypt.compare(loginPassword, checkUser.password)
        if(!checkPassword){
            return res.status(401).render("public/login",{status : "username and password is incorrect"})
        }
        req.session.isauth = true
        req.session.username = checkUser.firstName
        res.status(200).redirect("/")
    } catch (error) {
        console.log(error.message)
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
const signup = (req, res) => {
    try {
        res.render("public/signup")
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
                        isVarified: true,
                        blocked : false
                    })
                    await newUser.save()
                    .then(() => {
                        req.session.isAuth = true
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
    logOut
}