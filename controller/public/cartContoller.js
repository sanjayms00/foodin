const Cart = require("../../models/public/cartModel")




const showCart = async (req, res) => {
    try {
        res.render("public/cart")
    } catch (error) {
        console.log(error.message)
    }
}



const addToCart = async (req, res) => {
    
    try {
        const {foodName, foodId, foodType, price} = req.body
        const userId = req.session.isauth
        if(!userId){
            res.status(401).json({status : "error", msg : "User is not found, Login to your account"})
        } else {
            
            const findCart = await Cart.findOne({ userId: userId });

if (!findCart) {
  const newCart = new Cart({
    userId,
    items: []
  });
  await newCart.save();
}
  
  const existingItem = Cart.findOne({userId},{items: {$elemMatch: {foodId}}})
  
  console.log(existingItem)

if (existingItem) {
} else {
  findCart.items.push({
    foodId,
    foodName,
    price,
    qty: 1,
    createdAt: new Date(),
    type: foodType
  });
  const saveData = await findCart.save();
  if (!saveData) {
    res.status(400).json({ status: "error", msg: "Unable to add food to cart" });
  } else {
    res.status(200).json({ status: "success", msg: "Item added to cart successfully" });
  }
}
        }
    } catch (error) {
        res.status(400).json({status : "error", msg : "Unable to add product to cart"})
    }
}

module.exports = {
    addToCart,
    showCart
    
}