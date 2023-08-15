const Orders = require("../../models/admin/ordersModel")

const dashboard = async (req,res)=>{
    try {
        
        const period = req.query.sale
        let matchStage = {}
        if(period === "today"){
            matchStage = {
                $expr : {
                    $dayOfMonth : '$time'
                }
            }
        }
        else if(period === "month"){
            matchStage = {
                $expr : {
                    $month : '$time'
                }
            }
        }
        else if(period === "year"){
            matchStage = {
                $expr : {
                    $year : '$time'
                }
            }
        }
        var orderReport = await Orders.aggregate([
            {$match : matchStage}
        ])
        const currentYear = new Date().getFullYear();
        const graphValue = await Orders.aggregate([
            // {$match : {time : {
            //     $gte : new Date(`${currentYear}-01-01`),
            //     $lt : 
            // }}},
            {$group : {
                _id : {month : {$month : '$time'}},
                totalSubTotal : {$sum : '$subTotal'} 
                }
            },
            {$sort : {'_id.month' : 1}}
        ])
        //console.log(graphValue.length)
        const monthlyOrderPrices = Array.from({ length: 12 }, () => 0);
        for(let i = 0; i < graphValue.length ; i++){
            if(graphValue[i]._id.month){
                monthlyOrderPrices[graphValue[i]._id.month] = graphValue[i].totalSubTotal
            }
        }
        res.status(200).render("admin/dashboard", {orderReport, monthlyOrderPrices})
        
    } catch (error) {
        res.status(500).render("public/errorPage", {layout : false, status : 'error', msg : error.message})
    }
}


//export all functions like objects
module.exports = {
    dashboard
}