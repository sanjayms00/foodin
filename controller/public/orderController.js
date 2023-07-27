const currentOrders = (req, res) => {
    try {
        res.render("public/currentOrders")
    } catch (error) {
        
    }
}
const orderHistory = (req, res) => {
    try {
        res.render("public/orderHistory")
    } catch (error) {
        
    }
}

module.exports = {
    currentOrders,
    orderHistory
}