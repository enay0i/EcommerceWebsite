const express = require("express");
const bcrypt = require('bcrypt');
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { Customer } = require('./model/product.model'); 
const productRoute = require("./route/product/productList");
const orderRoute = require("./route/order/orderRoute");
const { default: userRouter } = require("./route/userRoute");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.log("Error connecting to MongoDB: ", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Express App is Running");
});



// Additional routes
app.use("/productList", productRoute);
app.use("/orderList", orderRoute);

// Start the server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});



// ------------------------------------------------------
//API endpoint
app.use('/api/user',userRouter)
//