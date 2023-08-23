const Foods = require("../../models/admin/foodModel")
const Category = require("../../models/admin/categoryModel")
const sharp = require("sharp")
const fs = require("fs")
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const { rejects } = require("assert")

const showFood = async (req,res)=>{
    try {
        const foodData = await Foods.find({}).sort({ createdAt: -1 })
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

const saveFood = async (req, res) => {
    try {
      const {
        foodName, categories, foodType, orgPrice, discPrice, foodDescription, foodIngredients, qtyLimit} = req.body;
  
      if (!(foodName && categories && foodType && orgPrice && discPrice && foodDescription && foodIngredients && qtyLimit)) {
        return res.status(400).json({ status: "error", msg: "Fill all fields" });
      }
      const slug = foodName.trim().split(" ").join('-').toLowerCase();
      const checkFood = await Foods.findOne({ slug: slug });
      if (checkFood) {
        return res.status(400).json({ status: "error", msg: "Food Exists" });
      }
  
      const base64Image = req.body.croppedImage;
      const dataStartIndex = base64Image.indexOf(',') + 1;
      const imageBinaryData = base64Image.substring(dataStartIndex);
  
      // Decode the base64 data
      const decodedImage = Buffer.from(imageBinaryData, 'base64');
  
      const uploadDirectory = "./views/uploads/food"; // Update with your directory
      const fileExtension = '.jpg'; // Update with your desired extension
      const newFileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDirectory, newFileName);
  
      // Make the directory if it doesn't exist
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
      }
  
      await sharp(req.file.buffer)
        .resize({ width: 720, height: 720 })
        .toFile(filePath, (err, info) => {
          if (err) {
            return res.status(400).json({ msg: `Error while processing the image ${err}` });
          }
        });
  
      const newFood = new Foods({
        image: newFileName,
        foodName: foodName,
        orgPrice: orgPrice,
        discPrice: discPrice,
        slug: slug,
        foodLimit: qtyLimit,
        category: categories,
        type: foodType,
        description: foodDescription,
        ingredients: foodIngredients,
        status: true,
        createdAt: new Date()
      });
  
      const saveData = await newFood.save();
      if (!saveData) {
        return res.status(500).json({ msg: "Food insertion failed" });
      }
  
      res.status(200).json({ status: "success", msg: "Added Food Successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "error", msg: "Food creation failed" });
    }
}



function saveData(foodName, foodId, newFileName, prevImage, categories, foodType, orgPrice, discPrice, foodDescription, foodIngredients){
    return new Promise(async (resolve, reject)=>{
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
            createdAt : new Date()
        }
        await Foods.updateOne({ _id: foodId},{$set : updateFood})
        .then((response)=>{
            resolve(response)
        })
        .catch((err)=>{
            reject(err)
        })
    })
}


const updateFood = async (req, res) => {
  try {
    const {prevSlug, foodName, croppedImage, foodId, prevImage, categories, foodType, orgPrice, discPrice, foodDescription, foodIngredients} = req.body
       
    if(!(foodId || prevImage || foodName || categories || foodType || orgPrice || discPrice || foodDescription || foodIngredients)){
        return res.status(400).json({status : "error", msg : "fill all fields"})
    }
    const slug = foodName.trim().split(" ").join('-').toLocaleLowerCase()
    
    if(slug !== prevSlug){
        const checkFood = await Foods.findOne({slug : slug})
        if(checkFood){
            return res.status(400).json({status : "error" , msg : "Food Exist"})
        }
    }
    //split image
    const parts = croppedImage.split('/food/');
    const fileName = parts[1];

    //work if they match
    if(fileName !== prevImage){
      const base64Image = croppedImage;
      const dataStartIndex = base64Image.indexOf(',') + 1;
      const imageBinaryData = base64Image.substring(dataStartIndex);

      // Decode the base64 data
      const decodedImage = Buffer.from(imageBinaryData, 'base64');

      const uploadDirectory = "./views/uploads/food"; // Update with your directory
      const fileExtension = '.jpg'; // Update with your desired extension
      var newFileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDirectory, newFileName);

      // Make the directory if it doesn't exist
      if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
      }

      await sharp(req.file.buffer)
        .resize({ width: 720, height: 720 })
        .toFile(filePath, (err, info) => {
          if (err) {
            return res.status(400).json({ msg: `Error while processing the image ${err}` });
          }
        });
      const prevImagePath = path.join(uploadDirectory, prevImage);

      // Check if the file exists before attempting to delete
      if (fs.existsSync(prevImagePath)) {
          // Delete the file
          fs.unlinkSync(prevImagePath);
          console.log(`Image ${prevImage} deleted successfully.`);
      } else {
          return res.status(404).json({status : "error", msg : 'Image not found'});
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
        createdAt : new Date()
    };
    console.log("upload...")
    const saveData = await Foods.updateOne({ _id: foodId},{$set : updateFood})
    if (!saveData) {
    return res.status(500).json({ msg: "Food updation failed" });
    }
    res.status(200).json({ status: "success", msg: "updated Food Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", msg: "Food creation failed" });
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



const foodStatus = async (req, res)=>{
    try {
        const foodStatus = req.params.status
        const foodStat = foodStatus.split("-")
        const [foodId, status] = foodStat
        const updateStatus = await Foods.updateOne({_id : foodId}, {$set : {status : status === "true"}})
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