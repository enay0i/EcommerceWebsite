import React, { useState ,useEffect} from 'react';
import { useGet } from "../../hook/hook";
import { Table, Spin, Alert, Button, Space, notification, Select, Modal, Tag,DatePicker } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { FaSearch } from "react-icons/fa";
import { ExportToExcel } from '../../components/ExportToExcel';
const OrderAdmin = ({token}) => {
  const { RangePicker } = DatePicker;
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [searchText, setSearchText] = useState("");
  const[orders,setOrders]=useState([]);
  const[filteredOrders,setfilteredOrders]=useState([]);
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/orderList/orders",{
        headers: {
          token: token, 
        },
      });
      setOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };
  const fetchfilterOrders = async () => {
    try {
      const response = await axios.get("http://localhost:4000/orderList/orderdone",{
        headers: {
          token: token, 
        },
      });
      setfilteredOrders(response.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };
  useEffect(() => {
    fetchOrders();
    fetchfilterOrders();
  }, []);
  const stateOptions = {
    "Chờ xác nhận": ["Đã xác nhận", "Đã hủy"],
    "Đã xác nhận": ["Đang đóng gói","Đang giao hàng","Đã hủy"],
    "Đang đóng gói": ["Đang giao hàng"],
    "Đang giao hàng": ["Giao hàng thành công", "Giao hàng thất bại"],
    "Giao hàng thất bại": ["Đang giao hàng","Đã hủy"],
    "Giao hàng thành công": [],
    "Đã hủy": []
  };
  const handleDateChange = (dates) => {
    setSelectedDateRange(dates);
  };

  const isDateInRange = (date) => {
    if (!selectedDateRange[0] || !selectedDateRange[1]) return true;
    const orderDate = new Date(date);
    const startDate = new Date(selectedDateRange[0]);
    const endDate = new Date(selectedDateRange[1]);
    endDate.setHours(23, 59, 59, 999); 
    return orderDate >= startDate && orderDate <= endDate;
  };
  
  const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};
const confirmOrder = async (orderId, newState) => {
  try {
    const response = await axios.post(`http://localhost:4000/orderList/confirmOrder/${orderId}`, { state: newState },{
      headers: {
        token: token, 
      },
    });
    if (response.data.status === 'OK') {
      notification.success({
        message: 'Xác Nhận Thành Công',
        description: 'Đơn hàng đã được xác nhận!',
      });
      fetchOrders();
      fetchfilterOrders();
    } else {
      notification.error({
        message: 'Xác Nhận Thất Bại',
        description: 'Không thể xác nhận đơn hàng.',
      });
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi không xác định.";
    notification.error({
      message: 'Xác Nhận Thất Bại',
      description: errorMessage,
    });
  }
};



  const showOrderDetails = async (order) => {
    setOrderDetails(order);
    setIsModalVisible(true);

    try {
      const response = await axios.get(`http://localhost:4000/orderList/orders/${order._id}`,{
        headers:{token:token}
      }
      );
      if (response.data) {
        setProductDetails(response.data.detailedProducts);  
      }
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải thông tin chi tiết sản phẩm.',
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setOrderDetails(null);
    setProductDetails([]);
  };

  const columnsForProcessing = [
    {
      title: 'Khách Hàng',
      dataIndex: 'guestInfo',
      key: 'guestInfo',
      render: (guestInfo) => (
        <div className="w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
          {`${guestInfo.firstname} ${guestInfo.name}`}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: ['guestInfo', 'email'],
      key: 'email',
      render: (email) => (
        <div className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
          {email}
        </div>
      ),
    },
    {
      title: 'Địa Chỉ',
      dataIndex: ['guestInfo', 'address'],
      key: 'address',
      width: 250,
    },
    {
      title: 'Ngày Đặt Hàng',
      dataIndex: 'dateCreate',
      key: 'dateCreate',
      width: 180,
      render: (date) => new Date(date).toLocaleString('vi-VN')
    },
    {
      title: 'Tổng Tiền',
      dataIndex: ['guestInfo', 'totalMoney'], 
      key: 'totalMoney',
      width: 120, 
      render: (totalMoney) => formatToVND(totalMoney),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'state',
      key: 'state',
      width: 150,
      filters: [
        { text: 'Chờ xác nhận', value: 'Chờ xác nhận' },
        { text: 'Đã xác nhận', value: 'Đã xác nhận' },
        { text: 'Đang giao hàng', value: 'Đang giao hàng' },
        { text: 'Đang đóng gói', value: 'Đang đóng gói' },
      ],
      onFilter: (value, record) => record.state.includes(value),
      sorter: (a, b) => a.state.localeCompare(b.state),
      render: (state, record) => (
        <Select
          defaultValue={state}
          onChange={(value) => confirmOrder(record._id, value)}
          style={{ width: '100%' }}
        >
          {stateOptions[state].map((nextState) => (
            <Select.Option key={nextState} value={nextState}>
              {nextState}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Tùy Chọn',
      key: 'action',
      width: 120, 
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<InfoCircleOutlined />} className='text-gray-600' onClick={() => showOrderDetails(record)} />
        </Space>
      ),
    },
];

const columnsForCompleted = [
  {
    title: 'Khách Hàng',
    dataIndex: 'guestInfo',
    key: 'guestInfo',
    render: (guestInfo) => (
      <div className="w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
        {`${guestInfo.firstname} ${guestInfo.name}`}
      </div>
    ),
  },
  {
    title: 'Email',
    dataIndex: ['guestInfo', 'email'],
    key: 'email',
    render: (email) => (
      <div className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {email}
      </div>
    ),
  },
  {
    title: 'Địa Chỉ',
    dataIndex: ['guestInfo', 'address'],
    key: 'address',
    width: 250, 
  },
  {
    title: 'Ngày Đặt Hàng',
    dataIndex: 'dateCreate',
    key: 'dateCreate',
    width: 180, 
    render: (date) => new Date(date).toLocaleString('vi-VN')
  },
  {
    title: 'Tổng Tiền',
    dataIndex: ['guestInfo', 'totalMoney'], 
    key: 'totalMoney',
    width: 120, 
    render: (totalMoney) => formatToVND(totalMoney),
  },
  {
    title: 'Trạng Thái',
    dataIndex: 'state',
    key: 'state',
    width: 150, 
    filters: [
      { text: 'Giao hàng thành công', value: 'Giao hàng thành công' },
      { text: 'Đã hủy', value: 'Đã hủy' },
    ],
    onFilter: (value, record) => record.state.includes(value),
    sorter: (a, b) => a.state.localeCompare(b.state),
    render: (state) => {
      let color = '';
      switch (state) {
        case 'Giao hàng thành công':
          color = 'green';
          break;
        case 'Đã hủy':
          color = 'red';
          break;
        default:
          color = 'geekblue'; 
      }
      return <Tag color={color}>{state}</Tag>;
    }
  },
  {
    title: 'Tùy Chọn',
    key: 'action',
    width: 150, 
    
    render: (text, record) => {
      const formattedData = {
        "Họ Tên": record.guestInfo.name,
        "Email": record.guestInfo.email,
        "Số Điện Thoại": record.guestInfo.phone,
        "Ngày Đặt Hàng": new Date(record.dateCreate).toLocaleDateString('vi-VN'), 
        "Tổng Giá": record.guestInfo.totalMoney,
      };

      return (
        <Space size="middle">
          {record.state === "Giao hàng thành công" ? (
            <ExportToExcel 
              apiData={[formattedData]} 
              buttonName={"Xuất Hóa Đơn"} 
              fileName={"Hóa Đơn"}
            />
          ) : record.state === "Đã hủy" ? (
            <Button 
              icon={<InfoCircleOutlined />} 
              className='text-gray-600' 
              onClick={() => showOrderDetails(record)} 
            />
          ) : (
            <Button 
              icon={<InfoCircleOutlined />} 
              className='text-gray-600' 
              onClick={() => showOrderDetails(record)} 
            />
          )}
        </Space>
      );
    }
  },
];


  const formattedData = orders.map(order => ({
    key: order._id,
    _id: order._id,
    guestInfo: order.guestInfo,
    dateCreate: order.dateCreate,
    state: order.state,
  })).filter(order =>
    (order.guestInfo.firstname && order.guestInfo.firstname.toLowerCase().includes(searchText.toLowerCase())) ||
    (order.guestInfo.name && order.guestInfo.name.toLowerCase().includes(searchText.toLowerCase())) ||
    (order.guestInfo.email && order.guestInfo.email.toLowerCase().includes(searchText.toLowerCase()))
  ).filter(order => isDateInRange(order.dateCreate));;

  const formattedFilteredData = filteredOrders.map(order => ({
    key: order._id,
    _id: order._id,
    guestInfo: order.guestInfo,
    dateCreate: order.dateCreate,
    state: order.state,
  })).filter(order =>
    (order.guestInfo.name && order.guestInfo.name.toLowerCase().includes(searchText.toLowerCase())) ||
    (order.guestInfo.email && order.guestInfo.email.toLowerCase().includes(searchText.toLowerCase()))
  ).filter(order => isDateInRange(order.dateCreate));;

  return (
    <div className='px-[10px] pt-[1px] h-full bg-[#F8F9FC]'>
      <div className='flex justify-between max-w-full items-center p-[10px] mt-2'>
        <div className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">Đơn hàng đang xử lý</div>
        <div className='flex gap-2 mt-4'>
        <RangePicker allowClear={false}
  onChange={handleDateChange}
  format="DD/MM/YYYY"
  placeholder={['Từ ngày', 'Đến ngày']} 
  className='h-10'
/>
          <div className="relative pb-2.5">
            <FaSearch className="text-[#9c9c9c] absolute top-1/4 left-3"/>
            <input
              type="text"
              className="pl-10 bg-[#E7E7E7]  h-[40px] text-black outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
              placeholder="Tìm kiếm"
              pagination={{ pageSize: 10 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Table 
        className='border-2 my-2' 
        columns={columnsForProcessing} 
        dataSource={formattedData} 
        pagination={{ pageSize: 4, total: orders.length }} 
      />

      <div className="text-[28px] ml-2 my-4 text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
        Đơn hàng đã xong
      </div>
      <Table 
        className='border-2 my-2' 
        columns={columnsForCompleted} 
        dataSource={formattedFilteredData} 
        pagination={{ pageSize: 4, total: filteredOrders.length }} 
      />

<Modal
  title={<div className="text-center font-bold text-lg">Chi Tiết Đơn Hàng</div>}
  visible={isModalVisible}
  onCancel={handleCancel}
  footer={null}
>
  {orderDetails && (
    <div className="p-5">
      <div className="mb-4">
        <p className="flex items-center mb-1"><strong className="w-[100px]">Khách Hàng:</strong> {orderDetails.guestInfo.firstname} {orderDetails.guestInfo.name}</p>
        <p className="flex items-center mb-1"><strong className="w-[100px]">Email:</strong> {orderDetails.guestInfo.email}</p>
        <p className="flex items-center mb-1"><strong className="w-[100px]">Địa Chỉ:</strong> {orderDetails.guestInfo.address}</p>
        <p className="flex items-center mb-1"><strong className="w-[100px]">Ngày Tạo:</strong> {new Date(orderDetails.dateCreate).toLocaleString('vi-VN')}</p>
        <p className="flex items-center mb-1"><strong className="w-[100px]">Tổng Tiền:</strong> {formatToVND(orderDetails.guestInfo.totalMoney)}</p>
        <p className="flex items-center mb-1"><strong className="w-[100px]">PTTT:</strong> {orderDetails.guestInfo.paymentMethod}</p>
        <p className="flex items-center mb-1"><strong className="w-[100px]">Giá đã giảm:</strong> {formatToVND(orderDetails.guestInfo.discount)}</p>
        <p className="flex items-center mb-1"><strong className="w-[100px]">Trạng Thái:</strong> {orderDetails.state}</p>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <p className="mb-2"><strong>Sản Phẩm:</strong></p>
        <div className="max-h-48 overflow-y-auto"> 
          {productDetails.length > 0 ? (
            productDetails.map((productDetail, index) => {
              const product = productDetail.product; 
              const imageUrl = product.additionalImages[0]; 
              return (
                <div key={index} className="flex items-center mb-2 p-2 border border-gray-300 rounded bg-gray-50">
                  <img src={imageUrl} alt={product.name} className="w-16 h-16 mr-4 rounded" />
                  <div>
                    <p className="text-md font-semibold">{product.name}</p>
                    <p className="text-sm">Kích cỡ: {productDetail.sizeID.sizeName} </p>
                    <p className="text-sm">Số lượng: {productDetail.quantity} </p>
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
    </div>
  )}
</Modal>
    </div>
  );
};

export default OrderAdmin;
