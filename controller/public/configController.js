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
        res.status(200).render("public/index", {status : "success"})
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
        const { firstName, lastName, email, mobileNumber, password, confirmPassword } = req.body
        //validate all fields
        if (!(firstName && lastName && email && mobileNumber && password && confirmPassword)) {
            return res.status(400).render("public/signup", { status: 'Please fill in all fields' });
        } 
        else 
        {
            const checkUser = await Users.findOne({email : email})
            if(checkUser){
                return res.status(409).render("public/signup", { status: 'User already exist, login to your account' });
            }else{
                if (password === confirmPassword) {
                    const strongPassword = await bcrypt.hash(password, 12)
                    const newUser = new Users({
                        firstName: firstName,
                        lastname: lastName,
                        email: email,
                        phone: mobileNumber,
                        password: strongPassword,
                        isVarified: true
                    })
                    await newUser.save()
                    .then(() => {
                        req.session.isAuth = true
                        res.status(200).render("public/login", {status : "success"})
                    }).catch((err) => {
                        console.log(err.message)
                        res.status(500).render("public/signup", {status : "issue in registering"})
                    })
                } else {
                    return res.status(400).render("public/signup", { status: 'Please fill in all fields' });
                }
            }
            
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ status: "internal server error" })
    }
}






//export all functions like objects
module.exports = {
    login,
    loginAuthenticate,
    forgotPassword,
    signup,
    signupAuthenticate,
}