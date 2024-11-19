const DB = require("../../model/product.model");
const express = require("express");
const ListRouter = express.Router();
const { confirmOrder, cancelOrder } = require('../order/orderController');
const { adminAuth, authUser } = require("../../middleware/adminAuth");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {sendOrderConfirmation} =require('../emailRoute')
ListRouter.get('/orderdone',adminAuth, async (req, res) => {
    try {
        const orders = await DB.Order.find({
            $or: [
                { state: "Giao hàng thành công" },
                { state: "Đã hủy" } 
            ]
        }).sort({ dateCreate: -1 }); 
        res.status(200).json(orders);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/orders',adminAuth, async (req, res) => {
    try {
        const orders = await DB.Order.find({
            state: { $nin: ["Giao hàng thành công", "Đã hủy"] } 
        }).sort({ dateCreate: -1 });
        res.status(200).json(orders);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/allorders', async (req, res) => {
    try {
        const orders = await DB.Order.find({ state: "Giao hàng thành công" }).sort({ dateCreate: -1 }); 
        res.status(200).json(orders);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/adu', async (req, res) => {
  try {
    const orders = await DB.Order.find({state:"Giao hàng thành công"});

    const ordersWithDetails = [];

    for (const order of orders) {
      const orderDetails = await DB.OrderDetail.find({ orderID: order._id }).populate({path:"productID",select:"name"});

      ordersWithDetails.push({
        order,
        orderDetails,
      });
    }

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders and their details' });
  }
});

ListRouter.get('/orders/:id',adminAuth, async (req, res) => {
    try {
        const order = await DB.Order.findById(req.params.id);
        const details = await DB.OrderDetail.find({ orderID: req.params.id }).populate({
            path: 'sizeID',
            select: 'sizeName', 
          });;
        const detailedProducts = await Promise.all(details.map(async (detail) => {
            const product = await DB.Product.findById(detail.productID);
            return {
                ...detail.toObject(), 
                product, 
            };
        }));

        res.status(200).json({ order, detailedProducts });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

ListRouter.get('/vouchers', async (req, res) => {
    try {
        const customers = await DB.Voucher.find();
        res.status(200).json(customers);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/orderDetail', async (req, res) => {
    try {
        const customers = await DB.OrderDetail.find();
        res.status(200).json(customers);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.post('/buy', authUser, async (req, res) => {
    try {
      const { cusID, voucherID, guestInfo, orderDetails } = req.body;
  
      if (!guestInfo || !guestInfo.name || !guestInfo.email || !guestInfo.address || !guestInfo.phone) {
        return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin giao hàng" });
      }
  
      const email = guestInfo.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const minEmailLength = 5;
      const maxEmailLength = 50;
  
      if (
        !email.match(emailRegex) ||
        email.length < minEmailLength ||
        email.length > maxEmailLength ||
        email.includes('..')
      ) {
        return res.status(400).json({ success: false, message: "Vui lòng nhập đúng định dạng email" });
      }
  
      if (guestInfo.phone.length !== 10 || guestInfo.phone[0] !== '0') {
        return res.status(400).json({ success: false, message: "Vui lòng nhập đúng định dạng số điện thoại" });
      }
  
      if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
        return res.status(400).json({ success: false, message: "Phải có ít nhất 1 sản phẩm trong giỏ hàng" });
      }
  
      const newOrder = await DB.Order.create({
        cusID,
        voucherID,
        guestInfo,
      });
  
      const orderDetailPromises = orderDetails.map(async (detail) => {
        const orderDetail = await DB.OrderDetail.create({
          ...detail,
          orderID: newOrder._id,
        });

        const product = await DB.Product.findById(detail.productID);
        if (product) {
          const sizeToUpdate = product.size.find(s => s.sizeID.toString() === detail.sizeID.toString());
          if (sizeToUpdate) {
            sizeToUpdate.quantity -= detail.quantity;  
            await product.save();
          }
        }
  
        return orderDetail;
      });
      const final =await DB.OrderDetail.find({ orderID: newOrder._id })
      .populate('productID', 'name additionalImages') 
      .populate('sizeID', 'sizeName');
      await Promise.all(orderDetailPromises);
      res.status(201).json({ success: true, newOrder });
  
      await sendOrderConfirmation(newOrder, guestInfo, final);
    } catch (error) {
      console.error('Có lỗi trong lúc đặt hàng:', error);
      res.status(500).json({ message: 'Có lỗi trong lúc đặt hàng', error: error.message });
    }
  });
  

  ListRouter.post('/buystripe', authUser, async (req, res) => {
    try {
      const { cusID, voucherID, guestInfo, orderDetails } = req.body;
      const { origin } = req.headers;
  
      if (!guestInfo || !guestInfo.name || !guestInfo.email || !guestInfo.address || !guestInfo.phone) {
        return res.status(400).json({ success: false, message: "Vui lòng điền đầy đủ thông tin giao hàng" });
      }
  
      const email = guestInfo.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const minEmailLength = 5;
      const maxEmailLength = 50;
  
      if (
        !email.match(emailRegex) ||
        email.length < minEmailLength ||
        email.length > maxEmailLength ||
        email.includes('..')
      ) {
        return res.status(400).json({ success: false, message: "Vui lòng nhập đúng định dạng email" });
      }
  
      if (guestInfo.phone.length !== 10 || guestInfo.phone[0] !== '0') {
        return res.status(400).json({ success: false, message: "Vui lòng nhập đúng định dạng số điện thoại" });
      }
  
      if (!Array.isArray(orderDetails) || orderDetails.length === 0) {
        return res.status(400).json({ success: false, message: "Phải có ít nhất 1 sản phẩm trong giỏ hàng" });
      }
  
      const voucher = await DB.Voucher.findById(voucherID);
      let totalDiscount = 0;
      if (voucher) {
        totalDiscount = voucher.discount;
      }
  
      const newOrder = await DB.Order.create({
        cusID,
        voucherID,
        guestInfo,
        state: "Chờ xác nhận",
      });
  
      const orderDetailPromises = orderDetails.map(async (detail) => {
        const orderDetail = await DB.OrderDetail.create({
          ...detail,
          orderID: newOrder._id,
        });
  
        const product = await DB.Product.findById(detail.productID);
        if (product) {
          const sizeToUpdate = product.size.find(s => s.sizeID.toString() === detail.sizeID.toString());
          if (sizeToUpdate) {
            sizeToUpdate.quantity -= detail.quantity; 
            await product.save();
          }
        }
  
        return orderDetail;
      });
  await Promise.all(orderDetailPromises);
  const final =await DB.OrderDetail.find({ orderID: newOrder._id })
  .populate('productID', 'name additionalImages') 
  .populate('sizeID', 'sizeName');
      const line_items = await Promise.all(orderDetails.map(async (detail) => {
        const productName = await getProductName(detail.productID);
        const discountedPrice = detail.money - (detail.money * totalDiscount);
        return {
          price_data: {
            currency: 'vnd',
            product_data: { name: productName },
            unit_amount: discountedPrice,
          },
          quantity: detail.quantity,
        };
      }));
  
      line_items.push({
        price_data: {
          currency: 'vnd',
          product_data: { name: "Phí vận chuyển" },
          unit_amount: 20000,
        },
        quantity: 1,
      });
  
      const session = await stripe.checkout.sessions.create({
        success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
        line_items,
        mode: 'payment',
      });
      res.json({ success: true, session_url: session.url });
      await sendOrderConfirmation(newOrder._id, guestInfo,final);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
  


ListRouter.post('/verifyStripe',async(req,res)=>{
    const {orderId,success,userId}=req.body
    try {
        if(success==="true"){
            await DB.Order.findByIdAndUpdate(orderId,{payment:true,state:"Đã xác nhận","guestInfo.paymentMethod":'Stripe'});
            await DB.Customer.findByIdAndUpdate(userId,{cartData:{}});
            res.json({success:true});
        }else{
            await DB.Order.findByIdAndDelete(orderId)
            res.json({success:false})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

async function getProductName(productID) {
    const product = await DB.Product.findById(productID);
    return product ? product.name : "Unknown Product";
}



ListRouter.post('/confirmOrder/:id',adminAuth, confirmOrder);
ListRouter.post('/cancelOrder/:id',cancelOrder);
// ListRouter.post('/vouchers',adminAuth, async (req, res) => {
//     const { name, discount, startDate, endDate } = req.body;

//     try {
//         const newVoucher = new DB.Voucher({ name, discount, startDate, endDate });
//         await newVoucher.save();
//         res.status(201).json({ message: 'Tạo Voucher thành công', voucher: newVoucher });
//     } catch (error) { 
//         res.status(400).json({ error: 'Gặp lỗi trong lúc tạo Voucher', details: error.message });
//     }
// });
module.exports = ListRouter;