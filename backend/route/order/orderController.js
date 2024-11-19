
const {Order,Customer} = require('../../model/product.model'); 
const mongoose = require('mongoose');

const confirmOrder = async (req, res) => {
  const { id } = req.params;
  const { state } = req.body; 

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    if(state==="Giao hàng thành công")
    {
      order.state = state;
     order.dateCreate=Date.now();
    }
    else{
    order.state = state;
    }
    await order.save();

    res.status(200).json({ status: 'OK', message: 'Thay đổi trạng thái đơn hàng thành công !' });
  } catch (error) {
    console.error('Gặp lỗi khi cập nhật tình trnajg đơn:', error);
    res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  const cusID = req.params.id;
  const cus = await Order.findById(cusID);
  if (!cus) {
    return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
  }

  try {
    cus.state = "Đã hủy";
    await cus.save();
    return res.status(200).json({
      success:true,
      message: "Hủy đơn thành công",
      data: cus,
    });
  } catch (e) {
    console.error("Lỗi trong lúc hủy đơn: ", e);
    return res.status(500).json({
      success:false,
      message: "Error in activating customer",
      error: e.message,
    });
  }
};



module.exports = { confirmOrder,cancelOrder };
