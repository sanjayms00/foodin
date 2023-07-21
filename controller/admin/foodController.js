const Food = require("../../models/admin/foodmodel")

const showFood = async (req,res)=>{
    try {
        const userData = await Food.find({})
        res.status(200).render("admin/food/index", {data : userData})
    } catch (error) {
        console.log(error.message)
    }
}
const createFood = async (req,res)=>{
    try {
        res.status(200).render("admin/food/create")
    } catch (error) {
        console.log(error.message)
    }
}

//export all functions like objects
module.exports = {
    showFood,
    createFood
}