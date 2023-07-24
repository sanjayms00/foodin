const Food =  require("../../models/admin/foodModel")
const Category =  require("../../models/admin/categoryModel")

const home = async (req,res)=>{
    try {
        const foodData = await Food.find({status : true}).limit(12)
        const categoryData = await Category.find({})
        res.render("public/index", {food : foodData, categories : categoryData})
    } catch (error) {
        console.log(error.message)
    }
}


//export all functions like objects
module.exports = {
    home
}