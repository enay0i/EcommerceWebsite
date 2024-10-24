const DB = require("../../model/product.model");
const express = require("express");
const ListRouter = express.Router();
ListRouter.get('/order', async (req, res) => {
    try {
        const customers = await DB.Order.find({state:"Đã xác nhận"});
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
module.exports = ListRouter;