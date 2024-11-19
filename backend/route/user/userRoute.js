const express = require("express");
const { loginUser,loginAdmin,registerUser,activeCus,inactiveCus, updateCusInfo, changePassword } = require("./userController");

const { Customer,Order,OrderDetail,Product } = require("../../model/product.model");
const { adminAuth, authUser } = require("../../middleware/adminAuth");
const userRouter=express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/admin",loginAdmin);
userRouter.get("/customer",adminAuth,async(req,res)=>{
   try {
    const customer =await Customer.find();
    res.status(200).json(customer);
    
   } catch (error) {
    res.status(500).json({message:error.message});
   }
})
userRouter.get("/customer/:id",async(req,res)=>{
   try {
    const customer =await Customer.findById(req.params.id);
    res.status(200).json(customer);
    
   } catch (error) {
    res.status(500).json({message:error.message});
   }
})
userRouter.get('/orders/:id',authUser, async (req, res) => {
   try {
       const orders = await Order.find({ cusID: req.params.id }).sort({ dateCreate: -1 });;
       if (!orders.length) {
           return res.status(404).json({ message: "Không tìm thấy đơn đặt hàng nào từ khách hàng này" });
       }
       const detailPromise = orders.map(async (order) => {
           const orderDetails = await OrderDetail.find({ orderID: order._id }).populate({
            path: 'sizeID',
            select: 'sizeName', 
          });
           const productPromise = orderDetails.map(async (detail) => {
               const product = await Product.findById(detail.productID);
               return {
                   ...detail.toObject ? detail.toObject() : detail, 
                   product,
               };
           });
           
           const detailedProducts = await Promise.all(productPromise);
           return {
               ...order.toObject(), 
               orderDetail: detailedProducts,
           };
       });

       const detailedOrders = await Promise.all(detailPromise);
       res.status(200).json(detailedOrders);
   } catch (e) {
       console.error(e);
       res.status(500).json({ message: "An error occurred while fetching orders." });
   }
});
userRouter.post("/changePassword/:id",changePassword);
userRouter.post("/updateCus/:id",updateCusInfo);
userRouter.post("/active/:id",activeCus);
userRouter.post("/inactive/:id",inactiveCus)
module.exports = userRouter;