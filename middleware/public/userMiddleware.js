const isloggedIn = (req, res, next) => {
    if (req.session.user_id) {
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
module.exports = {
    isloggedIn,
    sessionCheck
}