const DB = require("../../model/product.model");
const express = require("express");
const ListRouter = express.Router();
const productController = require("../product/productController")

ListRouter.post('/createProduct', async (req, res) => {
    try {
      const newProduct = new DB.Product(req.body);
      await newProduct.save();
      res.status(201).json({ status: 'OK', message: 'Product Created Successfully', product: newProduct });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

ListRouter.get('/products', async (req, res) => {
    try {
        const products = await DB.Product.find();
        res.status(200).json(products);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});
ListRouter.get('/products/:id', async (req, res) => {
    try {
        const product = await DB.Product.findById(req.params.id );
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});


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
        const comments = await Comment.find();
        res.status(200).json(comments);
    } catch (e) {
        res.status(500).json({ message: e.message });
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
ListRouter.get('/color', async (req, res) => {
    try {
        const customers = await DB.Color.find();
        res.status(200).json(customers);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

ListRouter.post('/updateProduct/:id',productController.updateProduct);
ListRouter.delete('/deleteProduct/:id',productController.deleteProduct);
module.exports = ListRouter;
