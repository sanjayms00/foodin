const helpSupport = require("../../models/public/HelpSupportModel")

const loadPage = (req, res) => {
    try {
        res.status(200).render("public/help")
    } catch (error) {
        res.status(500).render("public/errorPage", {msg : "Something went wrong."})
    }
}

const saveIssue = async (req, res) => {
    try {
        console.log(req.body)
        const {issue} = req.body;
        const userId = req.session.isauth
        if(userId === undefined){
            return res.status(200).json({status : 'login', msg : "Please Login"})
        }
        console.log(userId)
        const data = new helpSupport({
            issue : issue,
            userId : userId
        })
        //save the data
        await data.save()
        res.status(200).json({status : 'success', msg : "Issue addressed"})
    } catch (error) {
        res.status(500).json({status : 'error', msg : error.message})
    }
}

//export
module.exports = {
    loadPage,
    saveIssue
}