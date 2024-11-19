const DB = require("../../model/product.model");
const moment = require('moment');

const deleteProduct = async (req, res) => {
  try {
    const productID = req.params.id; 

    const detail = await DB.OrderDetail.findOne({ productID: productID}); 
    if (detail) {
      return res.status(400).json({
        message: "Sản phẩm đã được đặt",
        data: detail,
      });
    }

    const deletedProduct = await DB.Product.findByIdAndDelete(productID);
    if (!deletedProduct) {
      return res.status(404).json({
        message: "Không tìm thấy sản phẩm",
      });
    }

    return res.status(200).json({success:true,
      message: "Xóa sản phẩm thành công",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const updateProduct = async (req, res) => {
  const {
    name,
    subcategoryID,
    categoryID,
    new_price,
    describe,
    size,
    additionalImages
  } = req.body;

  try {
    if (!name || !subcategoryID || !categoryID || !new_price || !describe || !size || !additionalImages) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
    }
    if (new_price < 1000) {
      return res.status(400).json({ success: false, message: "Giá tiền không được nhỏ hơn 1000" });
    }

    const productID = req.params.id;
    const product = await DB.Product.findById(productID);

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    product.name = name;
    product.categoryID = categoryID;
    product.subcategoryID = subcategoryID;
    product.new_price = new_price;
    product.describe = describe;
    product.size = size; 
    product.additionalImages = additionalImages;

    await product.save();

    return res.status(200).json({
      status: "OK",
      message: "Cập nhật sản phẩm thành công",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const updateVoucher = async (req, res) => {
  const { name, discount, startDate, endDate } = req.body;

  try {
    const today = moment().startOf('day');
    const end = moment(endDate);
    if (!end.isAfter(today.add(1, 'day'))) {
        return res.status(400).json({ success: false, message: "Ngày kết thúc phải ít nhất là ngày sau hôm nay" });
    }
    const updatedVoucher = await DB.Voucher.findByIdAndUpdate(
      req.params.id,
      { name, discount, startDate, endDate },
      { new: true }
    );
    if (!updatedVoucher) {
      return res.status(404).json({ message: "Không tìm thấy Voucher" });
    }
    res.json({ success:true,message: "Cập nhật Voucher thành công", voucher: updatedVoucher });
  } catch (error) {
    res.status(500).json({success:false, message: "Cập nhật Voucher thất bại", error });
  }
};

const deleteVoucher = async (req, res) => {
  try {
    const deletedVoucher = await DB.Voucher.findByIdAndDelete(req.params.id);
    if (!deletedVoucher) {
      return res.status(404).json({success:false,message: "Không tìm thấy Voucher" });
    }
    res.json({success:true, message: "Xóa Voucher thành công" });
  } catch (error) {
    res.status(500).json({success:false, message: "Xóa Voucher thất bại", error });
  }
};


module.exports = {
  deleteProduct,
  updateProduct,
  deleteVoucher,
  updateVoucher,
};
