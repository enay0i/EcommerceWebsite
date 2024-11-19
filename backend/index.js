const express = require("express");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const cookieParser = require('cookie-parser');
const { Customer } = require('./model/product.model'); 
const productRoute = require("./route/product/productList");
const orderRoute = require("./route/order/orderRoute");
const userRouter  = require("./route/user/userRoute");
const cartRouter = require("./route/cart/cartRoute");
const emailRouter = require("./route/emailRoute");



const app = express();
const port = process.env.PORT || 4000;
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("Error connecting to MongoDB: ", err));


app.get("/", (req, res) => {
  res.send("Express App is Running");
});




app.use("/productList", productRoute);
app.use("/orderList", orderRoute);
app.use('/api/user',userRouter);
app.use('/api/cart',cartRouter);
app.use('/api/email', emailRouter);
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});
