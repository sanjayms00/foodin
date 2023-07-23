const Food = require("../../models/admin/foodModel")

const detail = async (req,res)=>{
    try {
        const slug = req.params.slug
        const foodData = await Food.findOne({slug : slug})
        if(!slug){
            return res.status(400).render("public/detailPage", {msg : "no content to display"})
        }
        res.render("public/detailPage", {data : foodData})
    } catch (error) {
        console.log("error.message")
    }
}


//export all functions like objects
module.exports = {
    detail
}