import userModel from "../Models/userModel.js";

const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Ensure cartData exists

    cartData[req.body.itemId] = (cartData[req.body.itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });

    return res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.json({ success: false, message: "Error adding to cart" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Ensure cartData exists

    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
      if (cartData[req.body.itemId] === 0) {
        delete cartData[req.body.itemId]; // Remove item if count reaches 0
      }
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });

    return res.json({ success: true, message: "Removed From Cart" });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.json({ success: false, message: "Error removing from cart" });
  }
};

const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {}; // Ensure cartData exists

    return res.json({ success: true, cartData });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };
