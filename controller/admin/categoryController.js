const Category = require("../../models/admin/categoryModel")

const showCategory = async (req,res)=>{
    try {
        const categoryData = await Category.find({status : 1})
        res.status(200).render("admin/category/index", {data : categoryData})
    } catch (error) {
        console.log(error.message)
    }
}

const createCategory = async (req,res)=>{
    try {
        res.status(200).render("admin/category/create")
    } catch (error) {
        console.log(error.message)
    }
}

const editCategory = async (req,res)=>{
    try {
        const getCategoryData = await Category.findOne({_id : req.query.id})
        if(!getCategoryData){
            return res.status(404).render("admin/category/index", {status : "error",  msg :  "Unable to edit the category" })
        }
        res.status(200).render("admin/category/edit", {category : getCategoryData})
    } catch (error) {
        console.log(error.message)
    }
}

const updateCategory = async (req,res)=>{
    try {
        const{updateCategoryName, categoryId} = req.body
        if(!updateCategoryName){
            return res.status(400).json({status : "error", msg : "Category required"})
        }
        if(!categoryId){
            throw new Error();
        }
        const isExisting = await Category.findOne({categoryName : updateCategoryName})
        if(isExisting){
            
            return res.status(400).json({status : "error", msg : "Category already exist"})
        }
        const categoryUpdateResult = await Category.updateOne(
            {_id : categoryId},
            {$set : {categoryName : updateCategoryName}}
        );
        if(!categoryUpdateResult){
            return res.status(400).json({status : "error", msg : "Category insertion failed"})
        }
        return res.status(200).json({status : "success", msg : "Category updated"})
    } catch (error) {
        return res.status(500).json({status : "error", msg : "Category updation failed"})
    }
}

const deleteCategory = async (req,res)=>{
    try {
        const deleteCategoryData = await Category.deleteOne({_id : req.query.id})
        if(!deleteCategoryData){
            return res.status(400).redirect("admin/category")
        }
        res.status(200).redirect("/admin/category")
    } catch (error) {
        console.log(error.message)
    }
}

const saveCategory = async (req,res)=>{
    try {
        const {categoryName} = req.body
        console.log(categoryName)
        if(!categoryName){
            return res.status(400).json({status : "error", msg : "Category required"})
        }
        const isExisting = await Category.findOne({categoryName})
        if(isExisting){
            return res.status(400).json({status : "error", msg : "Category already exist"})
        }
        const newCategory = new Category({
            categoryName: categoryName,
            status : true
        })
        const saveData = await newCategory.save()
        if(!saveData){
            return res.status(400).json({status : "error", msg : "Category insertion failed"})
        }
        return res.status(200).json({status : "success", msg : "Category Inserted"})
    } catch (error) {
        return res.status(500).json({status : "error", msg : "Category insertion failed"})
    }
}


const categoryStatus = async (req,res)=>{
    try {
        const categoryStatus = req.params.status
        const categoryStat = categoryStatus.split("-")
        const [catId, status] = categoryStat
        const updateStatus = await Category.updateOne({_id : catId}, {$set : {status : status === "true"}})
        console.log(updateStatus)
        const categoryData = await Category.find({})
        if(!updateStatus){
            return res.status(400).render("admin/users", {data : categoryData, status : "error", msg : "Status Updation Failed"})
        }
        res.status(200).render("admin/users", {data : categoryData, status : "success", msg : "Status Updated"})
    } catch (error) {
        console.log(error.message)
    }
}



module.exports = {
    showCategory,
    createCategory,
    saveCategory,
    editCategory,
    updateCategory,
    deleteCategory,
    categoryStatus

}