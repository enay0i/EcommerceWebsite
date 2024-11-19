import React, { useState, useEffect } from "react";
import { Spin, Alert, Table, notification, Button, Space, Form } from "antd";
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import ModalAdd from "./AddVoucher";
import ModalDelete from "../modalz"; 
import moment from 'moment'
const VoucherTable = ({ token }) => {
  const [vouchers, setVouchers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const [header, setHeader] = useState("Thêm Voucher");
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm(); 

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/productList/voucher",{
        headers: {
          token: token,
        },
      });
      setVouchers(response.data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    }
  };

  const handleEditVoucher = async (voucherId) => {
    try {
      const response = await axios.get(`http://localhost:4000/productList/voucher/${voucherId}`, {
        headers: {
          token: token,
        },
      });
      form.setFieldsValue({
        name: response.data.name,
        discount: parseFloat(response.data.discount)*100,
        dates: [moment(response.data.startDate), moment(response.data.endDate)],
      });
      setSelectedVoucherId(voucherId);
      setHeader("Chỉnh sửa Voucher");
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error fetching voucher details:", error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/productList/deleteVoucher/${selectedVoucherId}`,{
        headers: {
          token: token,
        },
      });
      if (response.data.success) {
        notification.success({
          message: 'Xóa Voucher thành công',
          description: 'Voucher đã được xóa thành công !',
        });
        fetchVouchers();
        handleCancelDelete();
      } else {
        notification.error({
          message: 'Xóa Voucher thất bại',
          description: 'Voucher xóa thất bại',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Lỗi không xác định";
      notification.error({
        message: 'Xóa Voucher thất bại',
        description: errorMessage,
      });
    }
  };

  const showDeleteModal = (voucherId) => {
    setSelectedVoucherId(voucherId);
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
    setSelectedVoucherId(null);
  };
  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedVoucherId(null);
    form.resetFields();  
  };
  const handleAddOrUpdateVoucher = async (values) => {
    try {
      if (selectedVoucherId) {
        await axios.post(`http://localhost:4000/productList/updatevoucher/${selectedVoucherId}`, {
          ...values,
          discount: parseFloat(values.discount) / 100,
          startDate: values.dates[0],
          endDate: values.dates[1],
        }, {
          headers: {
            token: token,
          },
        });
       
        notification.success({
          message: 'Cập Nhật Voucher Thành Công',
          description: 'Voucher đã được cập nhật!',
        });
        fetchVouchers();
      } else {
        await axios.post("http://localhost:4000/productList/addvoucher", {
          ...values,
          discount: parseFloat(values.discount) / 100,
          startDate: values.dates[0],
          endDate: values.dates[1],
        },{
          headers: {
            token: token,
          },
        });
        notification.success({
          message: 'Thêm Voucher Mới Thành Công',
          description: 'Voucher đã được thêm thành công!',
        });
      }
      fetchVouchers();
      setIsModalVisible(false);
      setSelectedVoucherId(null); 
    } catch (error) {
      console.error("Lỗi trong quá trình xử lý voucher:", error);
      notification.error({
        message: 'Tạo Voucher Thất Bại',
        description: error.response?.data?.message || "An unknown error occurred.",
      });
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Chiết khấu", dataIndex: "discount", key: "discount", render: (discount) => `${discount * 100}%` },
    { title: "Ngày bắt đầu", dataIndex: "startDate", key: "startDate", render: (date) => new Date(date).toLocaleDateString('vi-VN') },
    { title: "Ngày hết hạn", dataIndex: "endDate", key: "endDate", render: (date) => new Date(date).toLocaleDateString('vi-VN') },
    {
      title: 'Tùy Chọn',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} className="text-yellow-500" onClick={() => handleEditVoucher(record._id)} />
          <Button icon={<DeleteOutlined />} onClick={() => showDeleteModal(record._id)} className="text-red-500" />
        </Space>
      ),
    },
  ];

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className='px-[10px] pt-[1px] h-full bg-[#F8F9FC]'>
    <div className='flex justify-between max-w-full items-center p-[10px] mt-2'>
      <div className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">Danh sách Voucher</div>
      <div className='flex gap-2 mt-2'>
        <div className="relative pb-2.5">
          <FaSearch className="text-[#9c9c9c] absolute top-1/4 left-3" />
          <input
            type="text"
            className="pl-10 bg-[#E7E7E7] h-[40px] text-black outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
            placeholder="Tìm kiếm"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        </div>
      </div>
      <Table dataSource={filteredVouchers} columns={columns} rowKey="_id" className="my-2 border-2" />
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        <div onClick={() => { setHeader("Thêm Voucher"); setIsModalVisible(true); }} className="text-white shadow-xl flex items-center text-center justify-center p-3 rounded-full bg-gradient-to-r from-black to-gray-500 cursor-pointer hover:scale-105 transition-transform duration-300">
          <PlusOutlined />
        </div>
      </div>
      <ModalAdd
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onOk={handleAddOrUpdateVoucher}
        form={form}
        header={header}
      />
      <ModalDelete
        open={isDeleteModalVisible}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        header={"Voucher"}
      />
    </div>
  );
};

export default VoucherTable;
