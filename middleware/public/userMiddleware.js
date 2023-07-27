const isloggedIn = (req, res, next) => {
    if (req.session.isauth) {
        res.redirect("/")
    }else{
        next();
    }
}
const sessionCheck = (req, res, next) => {
    const isAuthenticated = req.session.isauth ? true : false;
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
    loginCheck
}