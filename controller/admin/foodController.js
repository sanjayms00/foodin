const Foods = require("../../models/admin/foodmodel")

const showFood = async (req,res)=>{
    try {
        const userData = await Foods.find({})
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

const editFood = async (req,res)=>{
    try {
        res.status(200).render("admin/food/edit")
    } catch (error) {
        console.log(error.message)
    }
}

const deleteFood = async (req,res)=>{
    try {
        res.status(200).render("admin/food/edit")
    } catch (error) {
        console.log(error.message)
    }
}

const saveFood = async (req,res)=>{
    try {
        //foodImage
        const {foodName, categories, foodType, orgPrice, discPrice, foodDescription, foodIngredients} = req.body
        // console.log(req.body)
        // console.log(foodName, categories, foodType, orgPrice, discPrice, foodDescription, foodIngredients)
        if(!(foodName || categories || foodType || orgPrice || discPrice || foodDescription || foodIngredients)){
            console.log("fill")
            return res.status(400).render("admin/food/create", {msg : "fill all fields"})
        }
        const newFood = new Foods({
            // image: foodImage,
            foodName: foodName,
            orgPrice: orgPrice,
            discPrice: discPrice,
            category: categories,
            type: foodType,
            description : foodDescription,
            ingredients : foodIngredients,
            status : true
        })
        const saveData = await newFood.save()
        if(!saveData){
            console.log("500 eror")
            return res.status(500).render("admin/food/create", {msg : "food insertion failed"})
        }
        console.log("success")
        res.status(200).render("admin/food/index")
    } catch (error) {
        console.log(error.message)
    }
}

//export all functions like objects
module.exports = {
    showFood,
    createFood,
    saveFood,
    editFood,
    deleteFood

}