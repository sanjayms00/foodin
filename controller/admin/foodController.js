const Foods = require("../../models/admin/foodModel")
const Category = require("../../models/admin/categoryModel")
const sharp = require("sharp")
const fs = require("fs")
const path = require("path")
const { v4: uuidv4 } = require('uuid');

const showFood = async (req,res)=>{
    try {
        const foodData = await Foods.find({})
        res.status(200).render("admin/food/index", { data : foodData })
    } catch (error) {
        console.log(error.message)
    }
}

const createFood = async (req,res)=>{
    try {
        const categoryData = await Category.find({})
        res.status(200).render("admin/food/create", { category : categoryData })
    } catch (error) {
        console.log(error.message)
    }
}

const editFood = async (req,res)=>{
    try {
        const getFoodData = await Foods.findOne({_id : req.query.id})
        const categoryData = await Category.find({})
        if(!getFoodData){
            return res.status(404).render("admin/food/index", {msg :  "can not edit the food" })
        }
        res.status(200).render("admin/food/edit", {food : getFoodData, category : categoryData})
    } catch (error) {
        console.log(error.message)
    }
}

const updateFood = async (req,res)=>{
    try {
        const {foodId, prevImage, foodName, categories, foodType, orgPrice, discPrice, foodDescription, foodIngredients} = req.body
        if(!(foodId || prevImage || foodName || categories || foodType || orgPrice || discPrice || foodDescription || foodIngredients)){
            return res.status(400).render("admin/food/edit", {status : "error", msg : "fill all fields"})
        }
        if(req.file){
            const uploadDirectory = "./views/uploads/food"
            const fileExtension = path.extname(req.file.originalname);
            var newFileName = `${uuidv4()}${fileExtension}`;
            const filePath = path.join(uploadDirectory, newFileName);

            //make directory it its does not exist
            if (!fs.existsSync(uploadDirectory)) {
                fs.mkdirSync(uploadDirectory, { recursive: true });
            }
            await sharp(req.file.buffer)
            .resize({ width: 720, height: 720 })
            .toFile(filePath, (err, info) => {
                if (err) {
                    return res.status(400).render("admin/food/edit", {status : "error", msg : `Error while processing the image ${err}`})
                } 
            });  
            var slug = foodName.split(" ").join('-')
            const prevImagePath = path.join(uploadDirectory, prevImage);

            // Check if the file exists before attempting to delete
            if (fs.existsSync(prevImagePath)) {
                // Delete the file
                fs.unlinkSync(prevImagePath);
                // res.send(`Image ${prevImage} deleted successfully.`);
            } else {
                return res.status(404).render("admin/food/edit", {status : "error", msg : 'Image not found'});
            }
        }

        const updateFood = {
            image: (newFileName === null) ? prevImage : newFileName,
            foodName: foodName,
            orgPrice: orgPrice,
            discPrice: discPrice,
            slug : slug,
            category: categories,
            type: foodType,
            description : foodDescription,
            ingredients : foodIngredients,
        }
        const saveData = await Foods.updateOne({ _id: foodId},{$set : updateFood})
        if(!saveData){
            return res.status(500).render("admin/food/edit", {status : "error", msg : "Food cannot be Updated"})
        }
        res.status(200).render("admin/food/edit",{status : "success", msg : "Updated Successfully"})
    } catch (error) {
        console.log(error.message)
    }
}

const deleteFood = async (req,res)=>{
    try {
        const deleteUserData = await Foods.deleteOne({_id : req.query.id})
        if(!deleteUserData){
            return res.status(400).render("admin/food/index", {msg : "Can not delete food"})
        }
        res.redirect("/admin/food")
    } catch (error) {
        console.log(error.message)
    }
}

const saveFood = async (req,res)=>{
    try {
        const {foodName, categories, foodType, orgPrice, discPrice, foodDescription, foodIngredients} = req.body
        
        if(!(foodName || categories || foodType || orgPrice || discPrice || foodDescription || foodIngredients)){
            console.log("fill")
            return res.status(400).render("admin/food/create", {status : "error" , msg : "fill all fields"})
        }

        const uploadDirectory = "./views/uploads/food"
        const fileExtension = path.extname(req.file.originalname);
        const newFileName = `${uuidv4()}${fileExtension}`;
        const filePath = path.join(uploadDirectory, newFileName);
        //make directory it its does not exist
        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }
        await sharp(req.file.buffer)
        .resize({ width: 720, height: 720 })
        .toFile(filePath, (err, info) => {
            if (err) {
                return res.status(400).render("admin/food/create", {msg : `Error while processing the image ${err}`})
            } 
        });  
        const slug = foodName.split(" ").join('-')
        const newFood = new Foods({
            image: newFileName,
            foodName: foodName,
            orgPrice: orgPrice,
            discPrice: discPrice,
            slug : slug,
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
        res.status(200).render("admin/food/create",{status : "success", msg : "Added Food Successfully"})
    } catch (error) {
        console.log(error.message)
    }
}
const foodStatus = async (req, res)=>{
    try {
        const foodStatus = req.params.status
        const foodStat = foodStatus.split("-")
        const [foodId, status] = foodStat
        const updateStatus = await Foods.updateOne({_id : foodId}, {$set : {status : status === "true"}})
        console.log(updateStatus)
        const foodData = await Foods.find({})
        if(!updateStatus){
            return res.status(400).render("admin/food", {data : foodData, status : "error", msg : "Status Updation Failed"})
        }
        res.status(200).render("admin/food", {data : foodData, status : "success", msg : "Status Updated"})
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
    updateFood,
    deleteFood,
    foodStatus

}