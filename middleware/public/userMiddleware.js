const Users = require("../../models/public/userModel")

const isloggedIn = (req, res, next) => {
    if (req.session.isauth) {
        res.redirect("/")
    }else{
        next();
    }
}

const isBlocked = async (req,res,next) => {
    try {
        const checkBlockedUser = await Users.findOne({_id : req.session.isauth})
        if(!checkBlockedUser){
            res.redirect("/")
        }
        if(checkBlockedUser.blocked){
            res.redirect("/logout")
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}

const sessionCheck = (req, res, next) => {
    // console.log("session check")
    const isAuthenticated = req.session.isauth ? true : false;
    res.locals.userId = req.session.isauth;
    res.locals.isBlocked = req.session.isBlocked ? true : false; 
    res.locals.isAuthenticated = isAuthenticated;
    res.locals.userName = req.session.userName;
    next();
}

const loginCheck = (req,res,next)=>{
    if (req.session.isloggedIn === true) {
        next();
    }else{
        res.redirect("/")
    }
}

module.exports = {
    isloggedIn,
    sessionCheck,
    loginCheck,
    isBlocked
}