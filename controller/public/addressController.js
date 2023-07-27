const addressBook = (req, res) => {
    try {
        res.render("public/addressBook")
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
    trackOrder
}