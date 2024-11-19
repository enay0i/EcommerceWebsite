import React, { useEffect, useState } from 'react';
import { Table, DatePicker } from 'antd';
import axios from 'axios';
import moment from 'moment'
const SalesTable = () => {
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const fetchData = (date) => {
    const url = `http://localhost:4000/orderList/adu?date=${formatDate(date)}`;
  
    axios.get(url)
      .then((response) => {
        const orderDetails = response.data.flatMap(order => order.orderDetails);
  
        const productData = {};

        const filteredOrders = response.data.filter(order => {
          const orderDate = moment(order.order.dateCreate).format('YYYY-MM-DD');
          const selectedDateFormatted = moment(date).format('YYYY-MM-DD');
          return orderDate === selectedDateFormatted;
        });
  
        filteredOrders.forEach(order => {
          order.orderDetails.forEach(detail => {
            const productName = detail.productID.name;
            const quantity = detail.quantity;
            const totalMoney = detail.totalMoney;
  
            if (!productData[productName]) {
              productData[productName] = { quantity: 0, totalMoney: 0 };
            }
  
            productData[productName].quantity += quantity;
            productData[productName].totalMoney += totalMoney;
          });
        });
  
        const formattedData = Object.keys(productData).map(productName => ({
          key: productName,
          name: productName,
          quantity: productData[productName].quantity,
          totalMoney: productData[productName].totalMoney,
        }));
  
        setData(formattedData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };
  

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng đã bán',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalMoney',
      key: 'totalMoney',
      render: (text) => <span>{text.toLocaleString()}</span>,
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <DatePicker
          style={{ marginLeft: 16 }}
          onChange={(date) => setSelectedDate(date ? date.toDate() : new Date())} // Update the date when selected
          value={selectedDate ? moment(selectedDate) : null} // Convert Date to moment
          defaultValue={moment()} // Default to today
          disabledDate={(current) => current && current > moment()} // Disable future dates
        />
      </div>

      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
};

export default SalesTable;
