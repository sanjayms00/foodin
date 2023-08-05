const Users = require("../../models/public/userModel")
const mongoose = require("mongoose")
//show address
const addressBook = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.status(400).json({status : "error", msg : "failed to add address at the moment "})
        }else{
            const userId = req.session.isauth
            addressData = await Users.findOne({_id : userId}, {addresses : 1})
            res.render("public/addressBook", {address : addressData})
        }
        
    } catch (error) {
        
    }
}

//save address
const saveAddress = async (req, res) => {
    try {
        if(!req.session.isauth){
            res.status(400).json({status : "error", msg : "failed to add address at the moment "})
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

//edit address page show
const editAddress = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.session.isauth)
        if(!userId){
            //error page 
        }
        const addressId = new mongoose.Types.ObjectId(req.params.id)
        const address = await Users.aggregate([
            {$match : {_id : userId }},
            {$unwind : '$addresses'},
            {$match : {"addresses._id" : addressId}},
            {$project : {addresses : 1}}
        ])
        const add = address[0].addresses
        res.render("public/editAddressBook", {address : add})
    } catch (error) {
         console.log(error.message)
    }
}

//update address
const updateAddress = async (req, res) => {
    try {
        const userId = req.session.isauth
        if(!userId){
            return res.status(404).json({ status : "error", msg: 'user not found' });
        }
        
        const {fullName, addressId, mobileNumber, pinCode, addressLine, city, state, addressType} = req.body

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(addressId)) {
            return res.status(400).json({ error: 'Invalid userId or addressId' });
        }
        const updatedAddress = await Users.findOneAndUpdate(
            { _id: userId, 'addresses._id': addressId },
            { $set : {
                'addresses.$[elem].fullName': fullName,
                'addresses.$[elem].mobileNumber': mobileNumber,
                'addresses.$[elem].pinCode': pinCode,
                'addresses.$[elem].addressLine': addressLine,
                'addresses.$[elem].city': city,
                'addresses.$[elem].state': state,
                'addresses.$[elem].addressType': addressType,
            }},
            {   
                arrayFilters : [{'elem._id' : new mongoose.Types.ObjectId(addressId)}] 
            }
        );
  
      if (!updatedAddress) {
        return res.status(404).json({ error: 'Address not found' });
      }
      res.status(200).json({status : "success", msg : "updated the address"})

    } catch (error) {
        console.log(error.message)
    }
}

//delete address
//delete cart Item
const deleteAddress = async (req, res) => {
    try {

      const userId = new mongoose.Types.ObjectId(req.session.isauth);
      const addressId = new mongoose.Types.ObjectId(req.body._id);
  
      if (!userId) {
        return res.status(400).json({ status: "error", msg: "user not found" });
      }
      const result = await Users.updateOne(
        { _id: userId },
        { $pull: { addresses: { _id: addressId } } }
      );
      if (result.modifiedCount > 0) {
        return res.status(200).json({ status: "success", msg: "address deleted successfully" });
      } else {
        return res.status(200).json({ status: "error", msg: "failed to delete the address" });
      }
    } catch (error) {
      return res.status(500).json({ status: "error", msg: error.message });
    }
  };


const trackOrder = (req, res) => {
    try {
        res.render("public/trackOrder")
    } catch (error) {
        
    }
}

module.exports = {
    addressBook,
    editAddress,
    trackOrder,
    saveAddress,
    updateAddress,
    deleteAddress
}