
const dashboard = (req,res)=>{
    try {
        res.status(200).render("admin/dashboard")
    } catch (error) {
        console.log(error.message)
    }
}


//export all functions like objects
module.exports = {
    dashboard
}