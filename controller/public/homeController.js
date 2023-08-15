const Food =  require("../../models/admin/foodModel")
const Category =  require("../../models/admin/categoryModel")
const categoryController = require("./categoryController");
const home = async (req,res)=>{
    try {
        const foodData = await Food.find({status : true}).sort({_id : -1}).limit()
        const categories = await categoryController.categoryData()
        res.render("public/index", {food : foodData, categories})
    } catch (error) {
        console.log(error.message)
    }
}

const search = async (req, res) =>{
    try {
        const search = req.query.search
        const pattern = [
            {foodName : {$regex : search, $options : 'i'}},
            {description : {$regex : search, $options : 'i'}}
        ]
        const foodData = await Food.find({$or : pattern})
        res.status(200).render("public/searchPage", {search , food : foodData})
    } catch (error) {
        res.status(500).render("public/errorPage", {status : "error", msg : "Unable to find the product"})
    }
}

const showAllFoods = async (req, res) =>{
    try {   
        const page = req.query.page || 0
        const booksPerPage = 12
        const totalSize = await Food.count()
        const totalPages = Math.floor(totalSize / booksPerPage)
        const foodData =  Food.find({status : true}).sort({_id : -1}).skip(booksPerPage * page).limit(booksPerPage)
        const categories =  categoryController.categoryData()
        Promise.all([foodData, categories])
        .then((values) => {
            res.status(200).render("public/allFoods", {food : values[0], categories : values[1], currentPage : page, totalPages } )
        })
        .catch((err)=>{
            res.status(500).render("public/errorPage", {status : "error", msg : "Issue loading the page"})
        });
    } catch (error) {
        res.status(500).render("public/errorPage", {status : "error", msg : "Unable to show food"})
    }
}


module.exports = {
    home,
    search,
    showAllFoods
}