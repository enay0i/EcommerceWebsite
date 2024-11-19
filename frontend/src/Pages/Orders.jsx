import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { Button, Modal, Tabs } from 'antd';
import { toast } from 'react-toastify';

const Orders = () => {
  const { getUserIdFromToken,token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  const cusID = getUserIdFromToken();
  
  const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/user/orders/${cusID}`,{headers:{token:token}});
      const data = Array.isArray(response.data) ? response.data : [];
      setOrders(data);
      setFilteredOrders(data);  
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Không có đơn hàng nào để hiển thị.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [cusID]);

  const showOrderDetails = (order) => {
    setOrderDetails(order);
    setIsModalVisible(true);
    console.log("Order state:", order.state);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setOrderDetails(null);
  };

  const cancelOrder = async (id) => {
    try {
      const response = await axios.post(`http://localhost:4000/orderList/cancelOrder/${id}`);
      if (response.data.success) {
        fetchOrders();
        setIsModalVisible(false);
        toast.success("Hủy đơn hàng thành công");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleTabChange = (key) => {
    if (key === 'all') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.state === key);
      setFilteredOrders(filtered);
    }
  };

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'ĐƠN HÀNG'} text2={'CỦA TÔI'} />
      </div>

      <Tabs defaultActiveKey="all" onChange={handleTabChange} >
        <Tabs.TabPane tab="Tất cả" key="all" />
        <Tabs.TabPane tab="Chờ xác nhận" key="Chờ xác nhận"  />
        <Tabs.TabPane tab="Đã xác nhận" key="Đã xác nhận" />
        <Tabs.TabPane tab="Đang đóng gói" key="Đang đóng gói" />
        <Tabs.TabPane tab="Đang giao hàng" key="Đang giao hàng" />
        <Tabs.TabPane tab="Giao hàng thành công" key="Giao hàng thành công" />
        <Tabs.TabPane tab="Giao hàng thất bại" key="Giao hàng thất bại" />
        <Tabs.TabPane tab="Đã hủy" key="Đã hủy" />
      </Tabs>

      <div>
      {error ? (
  <p className="text-red-500">{error}</p>
) : (
  filteredOrders.length === 0 ? (
    <p className="text-center text-gray-500">Không có đơn hàng</p>
  ) : (
    filteredOrders.map((order, index) => (
      <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div className='flex items-start gap-6 text-sm'>
          <div>
            <p className='sm:text-base font-medium'>ĐƠN HÀNG CỦA {order.guestInfo.firstname + " " + order.guestInfo.name}</p>
            <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
              <p><strong>Tổng tiền: </strong> {formatToVND(order.guestInfo.totalMoney)}</p>
              <p className='border-spacing-2 max-w-sm overflow-hidden text-ellipsis whitespace-nowrap'><strong>Địa chỉ:</strong> {order.guestInfo.address}</p>
            </div>
            <p className='mt-2'>Thời Gian Đặt Hàng: <span className='text-gray-400'>{new Date(order.dateCreate).toLocaleString('vi-VN')}</span></p>
          </div>
        </div>
        <div className='md:w-1/2 flex justify-between'>
          <div className='flex items-center gap-2'>
            <p 
              className={`min-w-2 h-2 rounded-full ${
                order.state === "Giao hàng thành công" 
                  ? "bg-green-500" 
                  : order.state === "Đã hủy"
                  ? "bg-red-500"
                  : "bg-yellow-500"}`}></p>
            <p className='text-sm md:text-base'>{order.state}</p>
          </div>
          <button 
            className='border px-4 py-2 text-sm font-medium rounded-sm'
            onClick={() => showOrderDetails(order)}
          >
            Kiểm tra đơn hàng
          </button>
        </div>
      </div>
    ))
  )
)}

      </div>

      <Modal
        title={<div className="text-center font-bold text-lg">Chi Tiết Đơn Hàng</div>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {orderDetails && (
          <div className="p-5">
            <div className="space-y-1">
              <p><strong>Khách Hàng:</strong> {orderDetails.guestInfo.firstname} {orderDetails.guestInfo.name}</p>
              <p><strong>Email:</strong> {orderDetails.guestInfo.email}</p>
              <p><strong>Địa Chỉ:</strong> {orderDetails.guestInfo.address}</p>
              <p><strong>Ngày Tạo:</strong> {new Date(orderDetails.dateCreate).toLocaleString('vi-VN')}</p>
              <p><strong>Tổng Tiền:</strong> {formatToVND(orderDetails.guestInfo.totalMoney)}</p>
              <p><strong>PTTT:</strong> {orderDetails.guestInfo.paymentMethod}</p>
              <p><strong>Giá đã giảm:</strong> {formatToVND(orderDetails.guestInfo.discount)}</p>
              <p><strong>Trạng Thái:</strong> {orderDetails.state}</p>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <p className="mb-2"><strong>Sản Phẩm:</strong></p>
              <div className="max-h-48 overflow-y-auto">
                {orderDetails.orderDetail.length > 0 ? (
                  orderDetails.orderDetail.map((productDetail, index) => {
                    const product = productDetail.product;
                    const imageUrl = product.additionalImages[0];
                    return (
                      <div key={index} className="flex items-center mb-2 p-2 border border-gray-300 rounded bg-gray-50">
                        <img src={imageUrl} alt={product.name} className="w-16 h-16 mr-4 rounded" />
                        <div>
                          <p className="text-md font-semibold">{product.name}</p>
                          <p className="text-sm">Số lượng: {productDetail.quantity}</p>
                          <p className="text-sm">Kích cỡ: {productDetail.sizeID.sizeName}</p>
                          <p className="text-sm">Giá: {formatToVND(product.new_price)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">Không có thông tin sản phẩm.</p>
                )}
              </div>
            </div>
            {orderDetails.state !== 'Giao hàng thành công' && orderDetails.state !== 'Đã hủy' && orderDetails.state !== 'Đang giao hàng' && (
              <div className='text-center items-center justify-center'>
                <button
                  className="bg-red-600 hover:bg-red-300 text-white py-2 mt-2 px-4 rounded"
                  onClick={() => cancelOrder(orderDetails._id)}
                >
                  Hủy đơn hàng
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;
