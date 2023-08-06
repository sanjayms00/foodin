const Cart = require("../../models/public/cartModel");
const mongoose = require("mongoose")

//get cart total
async function getCartTotal(userId){
  const cartTotal = await Cart.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) }
    },
    {
      $unwind: "$items"
    },
    {
      $lookup: {
        from: "foods",
        localField: "items.foodId",
        foreignField: "_id",
        as: "carted"
      }
    },
    {
      $project: {
        item: "$items.foodId",
        quantity: "$items.quantity",
        total: "$items.total",
        carted: { $arrayElemAt: ["$carted", 0] }
      }
    },
    {
      $group: {
        _id : null,
        subTotal: { $sum: { $multiply: ["$quantity", "$carted.discPrice"] } }
      }
    }
  ]);
  return cartTotal
}

//get cart items
async function getCartItems(userId){
  const cartItems = await Cart.aggregate([
    {
      $match: {userId: new mongoose.Types.ObjectId(userId)}
    },
    
    {
      $unwind: "$items"
    },
    {
      $lookup: {
        from: "foods",
        localField: "items.foodId",
        foreignField: "_id",
        as: "carted"
      }
    },
    {
      $project: {
        item: "$items.foodId",
        quantity: "$items.quantity",
        total: "$items.total",
        carted: { $arrayElemAt: ["$carted", 0] }
      }
    }
  ]);
  return cartItems
}

//show cart
const showCart = async (req, res) => {
  try {
    const userId = req.session.isauth;
    if (!userId) {
      res.render("public/cart", {data : null});
    } else {
        const cart = await getCartItems(userId)
        const cartTotal = await getCartTotal(userId);
        res.render("public/cart", { cart, cartTotal });
      }
  } catch (error) {
    console.log(error.message);
  }
};

//delete cart Item
const deleteCartItem = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.session.isauth);
    const foodId = new mongoose.Types.ObjectId(req.body.foodId);

    if (!userId) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }
    const result = await Cart.updateOne(
      { userId: userId },
      { $pull: { items: { foodId } } }
    );
    if (result.modifiedCount > 0) {
      return res.status(200).json({ status: "success", msg: "item deleted successfully" });
    } else {
      return res.status(200).json({ status: "error", msg: "failed to delete the item from cart" });
    }
  } catch (error) {
    return res.status(500).json({ status: "error", msg: error.message });
  }
};

//add to cart
const addToCart = async (req, res) => {
    try {
      console.log("here")
      if(!req.session.isauth){
        return  res.status(404).json({status : "no-user", msg : "User not Found"})
      }
      console.log(req.body)
      const foodId = req.body._id;
      const foodPrice = req.body.discPrice;
      const findUser = await Cart.findOne({userId : req.session.isauth})
      console.log(findUser)
      if(!findUser){
        const newUser = new Cart({
          userId : req.session.isauth,
          items : [],
          subTotal : 0
        })
        newUser.save()
      }
      const existingItem = await Cart.findOne({
        userId: req.session.isauth,
        'items.foodId': foodId,
      });
      if (existingItem) {
        await Cart.updateOne(
          { userId: req.session.isauth, 'items.foodId': foodId },
          { $inc: { 'items.$.quantity': 1 , "items.$.total" : foodPrice} }  
        );
      }else{
        await Cart.updateOne({userId : req.session.isauth}, { $push: { items: {foodId : foodId, quantity : 1, total 
        : foodPrice} } })
      }
      res.status(200).json({status : "success", msg : "cart added successfully"})
    } catch (error) {
      res.status(500).json({status : "error", msg : error.message})
    }
};

//updateCartBuQuantity
// const updateCartBuQuantity = async (req, res) => {
//    try {
//     let {total, value, foodId} = req.body
//     const foodIdAsObjectId = new mongoose.Types.ObjectId(foodId);
//     const userId = req.session.isauth;
//     if (!userId) {
//       return res.status(400).json({ status: "error", msg: "user not found" });
//     }

//     const findUser = await Cart.findOne({userId : userId})
//     console.log(findUser)
//     if(!findUser){
//       return res.status(400).json({ status: "error", msg: "user not found" });
//     }
//     const result = await Cart.findOneAndUpdate({userId : userId, "items.foodId" : foodIdAsObjectId})

//     // const result = await Cart.updateOne(
//     //   { userId: new mongoose.Types.ObjectId(userId), 'items.foodId': foodIdAsObjectId },
//     //   { $set: { 'items.$.quantity': value , "items.$.total" : total} }
//     // );
//     console.log("result is : ")
//     console.log(result)
    
//    } catch (error) {
//       res.status(500).json({ status: "error", msg: error.message });
//    }
// }

const updateCartByQuantity = async (req, res) => {
  try {
    let { foodId, foodPrice, qty, stat} = req.body;
    const foodIdAsObjectId = new mongoose.Types.ObjectId(foodId);
    const userId = new mongoose.Types.ObjectId(req.session.isauth);

    if (!userId) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }
    const findUser = await Cart.findOne({ userId: userId });
    if (!findUser) {
      return res.status(400).json({ status: "error", msg: "user not found" });
    }

    if(qty < 1){
      await Cart.updateOne(
        { userId: userId },
        { $pull : { items :{ foodId : foodIdAsObjectId} }}
        );
      return res.status(400).json({ removed : true });
    }

    const result = await Cart.updateOne(
      { userId: userId, "items.foodId": foodIdAsObjectId },
      { $inc : { "items.$.quantity": stat, "items.$.total" : foodPrice}},
      {new : true});

    if (result.nModified === 0) {
      return res.status(400).json({ status: "error", msg: "document not found" });
    }

    const updatedItem = await Cart.findOne(
      { userId: userId, "items.foodId": foodIdAsObjectId },
      { "items.$": 1, _id : 0 }
    );
    const subTotal = await getCartTotal(req.session.isauth)
    res.json({ status: "success", msg: "Cart updated successfully", items: updatedItem.items, subTotal });

  } catch (error) {
    res.status(500).json({ status: "error", msg: error.message });
  }
};



module.exports = {
  addToCart,
  showCart,
  deleteCartItem,
  updateCartByQuantity
};
