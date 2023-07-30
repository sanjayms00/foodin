const Users = require("../../models/public/userModel")

const addressBook = (req, res) => {
    try {
        res.render("public/addressBook")
    } catch (error) {
        
    }
}


const saveAddress = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.status(400).json({status : "error", msg : "can't add address at the moment "})
        }else{
            const userId = req.session.isauth
            const address = {fullName, mobileNumber, pinCode, addressLine, city, state, addressType } = req.body
            // console.log(fullName, mobileNumber, pinCode, addressLine, city, state, addressType)
            const saveData = await Users.updateOne({_id : userId},{$push : {addresses : address} })
            if(!saveData){
                res.status(400).json({status : "error", msg : "can't add address at the moment "})
            }else{
                res.status(200).json({status : "success", msg : "address added successfully"})
            }
        }
        
    } catch (error) {
        
    }
}


const editaddressBook = (req, res) => {
    try {
        res.render("public/editProfile")
    } catch (error) {
        
    }
}

const trackOrder = (req, res) => {
    try {
        res.render("public/trackOrder")
    } catch (error) {
        
    }
}

module.exports = {
    addressBook,
    editaddressBook,
    trackOrder,
    saveAddress
}