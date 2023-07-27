const myProfile = (req, res) => {
    try {
        res.render("public/myProfile")
    } catch (error) {
        
    }
}
const editProfile = (req, res) => {
    try {
        res.render("public/editProfile")
    } catch (error) {
        
    }
}

module.exports = {
    myProfile,
    editProfile
}