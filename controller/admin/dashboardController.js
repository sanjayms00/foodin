const Orders = require("../../models/admin/ordersModel")

// const dashboard = async (req,res)=>{
//     try {
//         const period = req.query.sale
//         const date = new Date().getDate();
//         const year = new Date().getFullYear();
//         const month = new Date().getMonth()+1;
        
//         let matchStage = {}
//         if(period === "today"){
//             matchStage =  {
//                 time : {
//                     $eq : new Date(`${year}`-`${month}`-`${date}`)
//                 },
//                 $and : [{paymentStatus : 'recieved'}, {status : { $ne : 'canceled' }}]
//             }
//         }
//         else if(period === "month"){
//             matchStage = {
//                 $expr : {
//                     $month : '$time'
//                 }
//             }
//         }
//         else if(period === "year"){
//             matchStage = {
//                 $expr : {
//                     $year : '$time'
//                 }
//             }
//         }
//         res.status(200).render("admin/dashboard")
        
//     } catch (error) {
//         res.status(500).render("public/errorPage", {layout : false, status : 'error', msg : error.message})
//     }
// }

//load dashboard
const dashboard = async (req, res) => {
    try{
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();
        console.log(currentYear, currentMonth, currentDay)
        const todaysaleData = await Orders.aggregate([
            {
                $match : {
                    time :  {
                                $gte: new Date(currentYear, currentMonth - 1, currentDay),
                                $lt: new Date(currentYear, currentMonth - 1, currentDay + 1)
                            },
                    paymentStatus : 'recieved' ,
                    status : 'delivered'
                }
            },
            {
                $group: {
                    _id: null,
                    totalTodaySales: { $sum: 1 }, 
                    totalAmount: { $sum: { $add: ['$subTotal', '$walletAmount'] } } 
                }
            }
        ])
        const canceledOrders = await Orders.find({
            time : { 
                $gte: new Date(currentYear, currentMonth - 1, currentDay), 
                $lt: new Date(currentYear, currentMonth - 1, currentDay + 1)
            },
            status : 'canceled'
        }).count()
        console.log(canceledOrders)
        res.render('admin/dashboard', {orders : todaysaleData[0].totalTodaySales, totalAmount : todaysaleData[0].totalAmount, canceled : canceledOrders})
    }
    catch (error) {
        res.status(500).render("public/errorPage", { layout: false, status: 'error', msg: error.message });
    }
}

const getSaleData = async (req, res) => {
        const currentYear = new Date().getFullYear();
        const graphValue = await Orders.aggregate([
            {$match : {time : {
                $gte : new Date(`${currentYear}-01-01`),
                $lt : new Date(`${currentYear+1}-01-01`)
            }, paymentStatus : 'recieved', status : 'delivered'}},
            {$group : {
                _id : {month : {$month : '$time'}},
                totalSubTotal : {$sum : '$subTotal'} 
                }
            },
            {$sort : {'_id.month' : 1}}
        ])
        
        console.log(graphValue)
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
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        const currentDay = currentDate.getDate();

        let nextYear = currentYear;
        let nextMonth = currentMonth + 1;

        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear++;
        }
        let match = ''
        if(stat === 'today'){
            match = {
                time :  {
                    $gte: new Date(currentYear, currentMonth - 1, currentDay),
                    $lt: new Date(currentYear, currentMonth - 1, currentDay + 1)
                },
                paymentStatus : 'recieved' ,
                status : 'delivered'
            }
        }else if(stat === 'month'){
            match = {
                time: {
                    $gte: new Date(`${currentYear}-${currentMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`),
                    $lt: new Date(`${nextYear}-${nextMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`)
                },
                paymentStatus: 'recieved',
                status: 'delivered'
            }
        }else if(stat === "year"){
            match = {
                time: {
                    $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                    $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`)
                },
                paymentStatus: 'recieved',
                status: 'delivered'
            }
        }
        console.log(match)
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


const exportData = async (req, res) => {
    const format = req.query.format; // 'pdf' or 'excel'
  
    try {
      const data = await Orders.find(); // Fetch data from MongoDB
  
      if (format === 'pdf') {
        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=export.pdf');
        doc.pipe(res);
  
        // Add content to PDF
        data.forEach(item => {
          doc.text(item._id);
          // Add more fields as needed
        });
  
        doc.end();
      } else if (format === 'excel') {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data');
        
        // Add data to Excel
        worksheet.addRow(['Name', 'Age']); // Add header
        data.forEach(item => {
          worksheet.addRow([item.name, item.age]); // Add rows
        });
  
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=export.xlsx');
        await workbook.xlsx.write(res);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  }


//export all functions like objects
module.exports = {
    dashboard,
    getSaleData,
    showSalesDataGet,
    exportData
}