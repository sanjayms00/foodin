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
            return res.status(404).render("admin/category/index", {msg :  "can not edit the category" })
        }
        res.status(200).render("admin/category/edit", {category : getCategoryData})
    } catch (error) {
        console.log(error.message)
    }
}

const updateCategory = async (req,res)=>{
    try {
        const{categoryId, updateCategoryName} = req.body
        if(!(categoryId || updateCategoryName)){
            return res.render("admin/category/edit", {msg : "fill all fields"})
        }
        const categoryUpdateResult = await Category.updateOne({_id : categoryId},{$set : {categoryName : updateCategoryName}})
        if(!categoryUpdateResult){
            return res.status(400).render("admin/category/edit")
        }
        res.status(200).redirect("/admin/category")
    } catch (error) {
        console.log(error.message)
    }
}

const deleteCategory = async (req,res)=>{
    try {
        const deleteCategoryData = await Category.deleteOne({_id : req.query.id})
        if(!deleteCategoryData){
            return res.status(400).redorect("admin/category")
        }
        res.status(200).redirect("/admin/category")
    } catch (error) {
        console.log(error.message)
    }
}

const saveCategory = async (req,res)=>{
    try {
        const {categoryName} = req.body
        if(!(categoryName)){
            console.log("fill")
            return res.status(400).render("admin/category/create", {msg : "fill all fields"})
        }
        const newCategory = new Category({
            categoryName: categoryName,
            status : true
        })
        const saveData = await newCategory.save()
        if(!saveData){
            return res.status(500).render("admin/category/create", {msg : "Category insertion failed"})
        }
        console.log("success")
        res.status(200).redirect("/admin/category")
    } catch (error) {
        console.log(error.message)
    }
}

//export all functions like objects
module.exports = {
    showCategory,
    createCategory,
    saveCategory,
    editCategory,
    updateCategory,
    deleteCategory

}