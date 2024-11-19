const { Customer } = require("../../model/product.model")

const addToCart = async (req, res) => {
    try {
      const { userId, itemId, size } = req.body;
      const userData = await Customer.findById(userId);
      let cartData = userData.cartData || {};
  
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
  
      await Customer.findByIdAndUpdate(userId, { cartData });
      res.json({ success: true, message: "Thêm vào giỏ hàng thành công" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  
const updateCart=async(req,res)=>{
try {
    const{userId,itemId,size,quantity}=req.body;
    const userData =await Customer.findById(userId)
    let cartData=await userData.cartData
    cartData[itemId][size]=quantity
    await Customer.findByIdAndUpdate(userId,{cartData})
    res.json({success:true,message:"Giỏ hàng đã được cập nhật"})
} catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
}
}
const getUserCart=async(req,res)=>{
try {
    const {userId}=req.body
    const userData=await Customer.findById(userId)
    let cartData=await userData.cartData
    res.json({success:true,cartData})

} catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
}
}
const clearCart = async (req, res) => {
    try {
        await Customer.findByIdAndUpdate(req.params.id, { cartData: {} });
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports ={addToCart,getUserCart,updateCart,clearCart}