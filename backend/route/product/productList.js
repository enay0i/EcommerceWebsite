const DB = require("../../model/product.model");
const express = require("express");
const ListRouter = express.Router();
const productController = require("../product/productController");
const moment = require('moment');
const {adminAuth, authUser} = require("../../middleware/adminAuth");
const mongoose =require('mongoose');

// lien quan toi san pham
ListRouter.post('/createProduct',adminAuth, async (req, res) => {
    try {
      const newProduct = new DB.Product(req.body);
      await newProduct.save();
      res.status(201).json({ status: 'OK', message: 'Tạo sản phẩm thành công', product: newProduct });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  ListRouter.post('/addsize', adminAuth, async (req, res) => {
    try {
        const newSize = new DB.Size(req.body);
        await newSize.save();
        res.status(201).json({ status: 'OK', message: 'Kích cỡ được tạo thành công', size: newSize });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

ListRouter.post('/addcategory', adminAuth, async (req, res) => {
    try {
        const newCategory = new DB.Category(req.body);
        await newCategory.save();
        res.status(201).json({ status: 'OK', message: 'Danh mục được tạo thành công', category: newCategory });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
ListRouter.post('/addsubcategory', adminAuth, async (req, res) => {
    try {
        const newCategory = new DB.SubCategory(req.body);
        await newCategory.save();
        res.status(201).json({ status: 'OK', message: 'Loại được tạo thành công', SubCategory: newCategory });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

ListRouter.get('/products', async (req, res) => {
    try { 
        const products = await DB.Product.find().populate({
            path: 'size.sizeID', 
            select: 'sizeName'   
        });
        res.status(200).json(products);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/products/:id', async (req, res) => {
    try {
        const product = await DB.Product.findById(req.params.id)
            .populate({
                path: 'size.sizeID', 
                select: 'sizeName'   
            });
        
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.status(200).json(product);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


ListRouter.post('/updateProduct/:id',adminAuth,productController.updateProduct);
ListRouter.delete('/deleteProduct/:id',adminAuth,productController.deleteProduct);

ListRouter.get('/sizes', async (req, res) => {
    try {
        const sizes = await DB.Size.find();
        res.status(200).json(sizes);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


ListRouter.get('/comments', async (req, res) => {
    try {
        const comments = await DB.Comment.find();  
        res.status(200).json(comments);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/comments/:id', async (req, res) => {
    try {
        const comments = await DB.Comment.find({ productID: req.params.id })
            .populate({
                path: 'cusID',
                select: 'name', 
            })
            .sort({ dateCreate: -1 });  

        res.status(200).json(comments);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

ListRouter.post('/addcomment',async (req, res) => {
    try {
        const { content, rate, cusID, productID } = req.body;


        const customer = await DB.Customer.findById(cusID);
        if (!customer) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy khách hàng' });
        }

        const product = await DB.Product.findById(productID);
        if (!product) {
            return res.status(400).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        const existingComment = await DB.Comment.findOne({ cusID, productID });
        if (existingComment) {
            return res.status(400).json({ message: 'Bạn đã bình luận về sản phẩm này trước đó' });
        }

        const purchasedOrder = await DB.OrderDetail.findOne({
            productID: productID,
            orderID: { $in: await DB.Order.find({ cusID: cusID, state: "Giao hàng thành công" }).distinct('_id') }
        });
        if (!purchasedOrder) {
            return res.status(403).json({ success: false, message: 'Bạn chưa mua sản phẩm này nên không thể bình luận.' });
        }

        const newComment = new DB.Comment({
            content,
            rate,
            cusID: cusID,
            productID: productID,
        });

        await newComment.save();
        res.status(200).json({ success: true, message: 'Bạn đã đánh giá thành công' });

    } catch (error) {
        console.error('Error saving comment:', error);
        res.status(500).json({ success: false, error: 'Lỗi', details: error.message });
    }
});




ListRouter.get('/customers', async (req, res) => {
    try {
        const customers = await DB.Customer.find();
        res.status(200).json(customers);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/category', async (req, res) => {
    try {
        const customers = await DB.Category.find();
        res.status(200).json(customers);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/subcategory', async (req, res) => {
    try {
        const customers = await DB.SubCategory.find();
        res.status(200).json(customers);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// lien quan oti voucher
ListRouter.post('/addvoucher',adminAuth, async (req, res) => {
    try {
        const newVoucher = new DB.Voucher(req.body);
        const existingVoucher = await DB.Voucher.findOne({ name: newVoucher.name });
        if (existingVoucher) {
            return res.status(400).json({ success: false, message: "Tên voucher đã tồn tại" });
        }
        const today = moment().startOf('day');
        const end = moment(newVoucher.endDate);
        if (!end.isAfter(today.add(1, 'day'))) {
            return res.status(400).json({ success: false, message: "Ngày kết thúc phải ít nhất là ngày sau hôm nay" });
        }
        await newVoucher.save();
        res.status(201).json({ status: 'OK', message: 'Voucher được tạo thành công', voucher: newVoucher });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
ListRouter.get('/voucher', async (req, res) => {
    try {
        const products = await DB.Voucher.find();
        res.status(200).json(products);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/voucher/:id',adminAuth, async (req, res) => {
    try {
        const product = await DB.Voucher.findById(req.params.id );
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy Voucher" });
        }
        res.status(200).json(product);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.post('/updatevoucher/:id',adminAuth,productController.updateVoucher)
ListRouter.delete('/deletevoucher/:id',adminAuth,productController.deleteVoucher)


module.exports = ListRouter;
