import React, { useState,useEffect } from "react";
import { Spin, Alert, Table, Tag, Modal, notification } from "antd";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { useGet } from "../../hook/hook";

const CustomersList = ({token}) => {
  const[data,setData]=useState([]);
  const [searchText, setSearchText] = useState("");
  const [cusID, setCusID] = useState(null);
  const [reason, setReason] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [activateModalVisible, setActivateModalVisible] = useState(false);
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/productList/customers",{
        headers:{token:token}
      });
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  if (!data || data.length === 0) {
    return <Alert message="No customer data found" type="info" showIcon />;
  }

  const handleConfirm = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/user/inactive/${cusID}`, {
        reason: reason,
      });
      if (response.data.success) {
        notification.success({
          message: 'Hủy kích hoạt thành công',
          description: 'Tài khoản khách hàng đã bị hủy kích hoạt',
        });
        fetchCustomers(); 
        handleDeleteCancel();
        setReason(""); 
      } else {
        notification.error({
          message: 'Hủy kích hoạt thất bại',
          description: response.data.message,
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Hủy Kích Hoạt Khách Hàng Thất Bại',
        description: errorMessage,
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
    setCusID(null);
    setReason(""); 
  };

  const handleActivateConfirm = async () => {
    try {
      const response = await axios.post(`http://localhost:4000/api/user/active/${cusID}`);
      if (response.data.success) {
        notification.success({
          message: 'Kích hoạt tài khoản thành công',
          description: 'Tài khoản khách hàng đã được kích hoạt thành công!',
        });
        fetchCustomers();
        setActivateModalVisible(false);
      } else {
        notification.error({
          message: 'Kích hoạt tài khoản thất bại',
          description: 'Tài khoản khách hàng kích hoạt thất bại!',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Hủy Kích Hoạt Khách Hàng Thất Bại',
        description: errorMessage,
      });
    }
  };

  const columns = [
    { title: "Họ Tên", dataIndex: "name", key: "name", sorter: (a, b) => (a.name || "").localeCompare(b.name || ""), width: '25%' },
    { title: "Email", dataIndex: "email", key: "email", sorter: (a, b) => (a.email || "").localeCompare(b.email || ""), width: '25%' },
    { title: "Địa Chỉ", dataIndex: "address", key: "address" },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      filters: [
        { text: "Đã kích hoạt", value: true },
        { text: "Vô hiệu hóa", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive, record) => (
        <Tag
          color={isActive ? "green" : "red"}
          onClick={isActive ? () => {
            setCusID(record._id);
            setDeleteModalVisible(true);
          } : () => {
            setCusID(record._id);
            setActivateModalVisible(true);
          }}
          style={{ cursor: "pointer" }}
        >
          {isActive ? "Đã kích hoạt" : "Vô hiệu hóa"}
        </Tag>
      ),
    },
  ];

  const formattedData = data
    .map(customer => ({
      ...customer,
      key: customer._id,
    }))
    .filter(customer =>
      (customer.name && customer.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (customer.email && customer.email.toLowerCase().includes(searchText.toLowerCase()))
    );

  return (
    <div className="px-[25px] pt-[25px] h-full bg-[#F8F9FC] pb-[40px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">
          Tất cả khách hàng
        </h1>
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
      <Table
        className="mt-4 border-2 rounded-s"
        columns={columns}
        dataSource={formattedData}
        pagination={{ pageSize: 10 }}
      />
      <ModalDelete
        open={deleteModalVisible}
        onClose={handleDeleteCancel}
        onConfirm={handleConfirm}
        reason={reason}
        setReason={setReason}
      />
      <ModalActivate
        open={activateModalVisible}
        onClose={() => setActivateModalVisible(false)}
        onConfirm={handleActivateConfirm}
      />
    </div>
  );
};

const ModalDelete = ({ open, onClose, onConfirm, reason, setReason }) => {
  return (
    <Modal
      className="justify-center items-center"
      footer={null}
      visible={open}
      onCancel={onClose}
    >
      <div className="text-center">
        <div className="mx-auto my-4 w-64">
          <h3 className="text-lg w-full font-black text-red-600"> Vui lòng nhập lí do vô hiệu hóa tài khoản này</h3>
          <input
            type="text"
            placeholder="Lí do"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="mt-2 border rounded p-1 w-full"
          />
        </div>
        <div className="flex justify-around">
          <button onClick={onClose} className="bg-gray-300 w-1/4  rounded">
          Hủy
          </button>
          <button onClick={onConfirm} className="bg-red-500 w-1/4 text-white p-2 rounded">
          Chấp nhận
          </button>
        </div>
      </div>
    </Modal>
  );
};

const ModalActivate = ({ open, onClose, onConfirm }) => {
  return (
    <Modal
      className="justify-center items-center"
      footer={null}
      visible={open}
      onCancel={onClose}
    >
      <div className="text-center">
        <h3 className="text-lg font-black text-green-600">Kích Hoạt Tài Khoản</h3>
        <p className="text-sl text-gray-500">
          Bạn có chắc muốn kích hoạt lại tài khoản khách hàng này ?
        </p>
        <div className="flex justify-around mt-4">
          <button onClick={onClose} className="bg-gray-300 w-1/4 p-2 rounded">
           Hủy
          </button>
          <button onClick={onConfirm} className="bg-green-500 w-1/4 text-white p-2 rounded">
            Chấp nhận
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomersList;
