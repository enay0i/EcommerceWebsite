const mongoose = require('mongoose');

const product = new mongoose.Schema({
    name: { type: String, required: true },
    categoryID: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }],
    subcategoryID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
    },
    new_price: { type: Number, required: true },
    describe: { type: String, required: true },
    size: [{
     sizeID:{  type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
        required: true,
     },
     quantity:{type:Number, required:true},
    }],
    additionalImages: [{ type: String ,required:true}] , 
});

const size = new mongoose.Schema({
    sizeName: {type: String, required: true},
});

const category = new mongoose.Schema({
    cateName: {type: String, required: true},
});

const subcategory = new mongoose.Schema({
    subcateName: {type: String, required: true},
});
const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    rate: { type: Number, required: true, min: 1, max: 5 },
    cusID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    dateCreate:{type:Date, default: Date.now}
  });
  

const cus = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    phone: { type: String, required: false },
    address: {
      provinceId: { type: String },
      districtId: { type: String },
      wardId: { type: String },
      addressInput: { type: String },
    },
    password: { type: String, required: true },
    cartData:{ type:Object,default:{}},     
    isActive:{type:Boolean,default:true},
    reason: { type: String, required: false, default: null },
},{minimize:false});

const color = new mongoose.Schema({
    colorName: {type: String, required: true},
});
const order = new mongoose.Schema({
  cusID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
  },
  voucherID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Voucher",
      required: false,
  },
  guestInfo: {
      firstname: { type: String, required: false },
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String,default:"", required: true },
      phone: { type: String, required: false },
      note: { type: String, required: false },
      paymentMethod: { type: String, enum: ['VNPay', 'Stripe', 'COD'], required: true },
      totalMoney: { type: Number, required: true },
      discount: { type: Number, required: false },
  },
  dateCreate: { type: Date, default: Date.now },
  cancelReason: { type: String, required: false },
  state: { 
      type: String, 
      default: "Chờ xác nhận",
      enum: ["Chờ xác nhận", "Đã xác nhận", "Đã hủy","Đang giao hàng", "Đang đóng gói","Giao hàng thất bại","Giao hàng thành công"],
  },
});

  const orderDetail = new mongoose.Schema({
    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
      productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      sizeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Size",
        required: true,
      },
    quantity:{type: Number, required:false},
    totalMoney:{type: Number, required:false},
    money:{type: Number, required:false},
  });
  const voucher = new mongoose.Schema({
   name:{type: String, required:true},
   discount:{type: Number, required:true},
   startDate:{type: Date, required:true},
    endDate:{type: Date, required:true},
  });

const Product = mongoose.model("Product", product);
const Category = mongoose.model("Category", category);
const Comment = mongoose.model("Comment", commentSchema);
const Customer = mongoose.model("Customer", cus);
const Size = mongoose.model("Size", size);
const Color =mongoose.model("Color", color);
const Order = mongoose.model("Order", order);
const OrderDetail = mongoose.model("OrderDetail", orderDetail);
const Voucher = mongoose.model("Voucher", voucher);
const SubCategory = mongoose.model("SubCategory",subcategory);
module.exports = {
    Product,
    Category,
    Comment,
    Customer,
    Size,
    Color,
    Order,
    OrderDetail,
    Voucher,
    SubCategory,
};
