const login = (req,res)=>{
    res.send("login")
}


const signup = (req,res)=>{
    res.send("signup")
}

//export all functions like objects
module.exports = {
    login,
    signup
}