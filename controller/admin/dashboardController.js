const Orders = require("../../models/admin/ordersModel")

const dashboard = async (req,res)=>{
    try {
        const period = req.query.sale
        const date = new Date().getDate();
        const year = new Date().getFullYear();
        const month = new Date().getMonth()+1;
        
        let matchStage = {}
        if(period === "today"){
            matchStage =  {
                time : {
                    $eq : new Date(`${year}`-`${month}`-`${date}`)
                },
                $and : [{paymentStatus : 'recieved'}, {status : { $ne : 'canceled' }}]
            }
        }
        // else if(period === "month"){
        //     matchStage = {
        //         $expr : {
        //             $month : '$time'
        //         }
        //     }
        // }
        // else if(period === "year"){
        //     matchStage = {
        //         $expr : {
        //             $year : '$time'
        //         }
        //     }
        // }
        res.status(200).render("admin/dashboard")
        
    } catch (error) {
        res.status(500).render("public/errorPage", {layout : false, status : 'error', msg : error.message})
    }
}

const getSaleData = async (req, res) => {
        const currentYear = new Date().getFullYear();
        const graphValue = await Orders.aggregate([
            {$match : {time : {
                $gte : new Date(`${currentYear}-01-01`),
                $lt : new Date(`${currentYear+1}-01-01`)
            }}},
            {$group : {
                _id : {month : {$month : '$time'}},
                totalSubTotal : {$sum : '$subTotal'} 
                }
            },
            {$sort : {'_id.month' : 1}}
        ])
        
        //console.log(graphValue)
        const monthlyOrderPrices = Array.from({ length: 12 }, () => 0);
        for(let i = 0; i < graphValue.length ; i++){
            if(graphValue[i]._id.month){
                monthlyOrderPrices[graphValue[i]._id.month-1] = graphValue[i].totalSubTotal
            }
        }
        //console.log(monthlyOrderPrices)
        res.json({item : monthlyOrderPrices,})
}

const showSalesDataGet = async (req, res) => {
    const stat = req.query.sortBy || 'today'
    const orderReport = await getOrderReport(stat)
    res.render("admin/saleDataPage", {orderReport, orders : orderReport.length})
}


async function getOrderReport(stat){
    try {
        const currentDate = new Date();
        const currentDay = currentDate.toISOString();;
        const currentYear = currentDate.getFullYear();
        let currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        let nextMonth = (currentDate.getMonth() + 2).toString().padStart(2, '0');
        let match 
        if(stat === 'today'){
            match = {
                time: {
                    $gte: new Date(currentDay.substr(0, 10) + "T00:00:00.000Z"),
                    $lt: new Date(currentDay.substr(0, 10) + "T23:59:59.999Z")
                },
                $and : [{paymentStatus : 'recieved'}, {status : { $ne : 'canceled' }}]
            }
        }else if(stat === 'month'){
            match = {
                time: {
                    $gte: new Date(`${currentYear}-${currentMonth}-01T00:00:00.000Z`),
                    $lt: new Date(`${currentYear}-${nextMonth}-01T00:00:00.000Z`)
                }, 
                $and : [{paymentStatus : 'recieved'}, {status : { $ne : 'canceled' }}]
            }
        }else if(stat === "year"){
            match = {
                time: {
                    $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                    $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                },
                $and : [{paymentStatus : 'recieved'}, {status : { $ne : 'canceled' }}]
            }
        }
        const orderReport = await Orders.aggregate([
            {
                $match: match
            }, 
            {
                $lookup : {
                    from: 'users',
                    localField : 'user',
                    foreignField : '_id',
                    as : 'userData'
                }
            },
            {
                $unwind: '$userData'
            },
            {
                $project : {
                    _id : 0,
                    firstName : '$userData.firstName',
                    lastName : '$userData.lastName',
                    orderDetails : {
                        time: '$time',
                        orderId : '$_id',
                        status : '$status',
                        address : '$address',
                        paymentStatus : '$paymentStatus',
                        paymentMethod : '$paymentMethod',
                        walletAmount : '$walletAmount',
                        subTotal : '$subTotal',
                    }
                }
            }
        ]);
        return orderReport
    } catch (error) {
        
    }
}





//export all functions like objects
module.exports = {
    dashboard,
    getSaleData,
    showSalesDataGet
}