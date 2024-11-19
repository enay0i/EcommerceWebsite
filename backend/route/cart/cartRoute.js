const express =require('express')
const {addToCart,getUserCart,updateCart,clearCart} =require('../cart/cartController');
const { authUser } = require('../../middleware/adminAuth');
const cartRouter =express.Router();
cartRouter.post('/get',authUser,getUserCart);
cartRouter.post('/add',authUser,addToCart);
cartRouter.post('/update',authUser,updateCart);
cartRouter.post('/clear/:id',clearCart);

module.exports=cartRouter;