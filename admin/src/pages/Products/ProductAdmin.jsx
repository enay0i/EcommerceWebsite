import React, { useState } from 'react';
import { useGet } from "../../hook/hook";
import { Table, Spin, Alert, Button, Space, notification } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import ModalDelete from '../modalz';
import axios from 'axios';
import CreateProduct from './AddProduct';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaEnvelope, FaRegBell } from "react-icons/fa";
const ProductAdmin = () => {
  const navigate = useNavigate();
  const { data: products, error: productError, loading: productLoading } = useGet("http://localhost:4000/productList/products");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);  // Only store the product ID
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [onFinishHandler, setOnFinishHandler] = useState("");
  const [errMessage, setErrMessage] = useState('');  

  const showModal = (productId) => {
    if (productId) {
      setSelectedProductId(productId); 
      setHeader("Sửa Sản Phẩm");
      console.log(productId +"la product id")
      setOnFinishHandler(() => (values) => onFinishUpdate(values, productId)); 
    } else {
      setSelectedProductId(null);
      setHeader("Thêm Sản Phẩm");
      setOnFinishHandler(() => onFinishCreate);
    }
    setIsModalVisible(true);
  };
  


  const onFinishUpdate = async (values,id) => {
    try {
      const response = await axios.post(`http://localhost:4000/productList/updateProduct/${id}`, {
        ...values,
      });
      if (response.data.status === 'OK') {
        notification.success({
          message: 'Product Updated Successfully',
          description: 'The product has been updated successfully!',
        });
        navigate('/product');
        handleCancel(); 
      } else {
        setErrMessage('Product update failed!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Product Update Failed',
        description: errorMessage,
      });
      setErrMessage(errorMessage); 
    }
  };


  const onFinishCreate = async (values) => {
    const imgArray = values.additionalImages
      ? values.additionalImages.split(',').map(image => image.trim())
      : [];
    try {
      const response = await axios.post('http://localhost:4000/productList/createProduct', {
        ...values,
        additionalImages: imgArray,
      });

      if (response.data.status === 'OK') {
        notification.success({
          message: 'Product Created Successfully',
          description: 'The product has been created successfully!',
        });
        navigate('/product');
        handleCancel(); 
      } else {
        setErrMessage('Product creation failed!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Product Creation Failed',
        description: errorMessage,
      });
      setErrMessage(errorMessage);
    }
  };

  const showDeleteModal = (productId) => {
    setSelectedProductId(productId);
    setIsDeleteModalVisible(true);
  };

  const onClose=()=>{
    setSelectedProductId(null);
  }
  const handleCancel = () => {
    setIsDeleteModalVisible(false);
    setIsModalVisible(false); 
    setSelectedProductId(null);  
  };

  if (productLoading) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (productError) {
    return (
      <Alert
        message="Error"
        description="Failed to load products."
        type="error"
        showIcon
      />
    );
  }

  if (!products || products.length === 0) {
    return <Alert message="No products found" type="info" showIcon />;
  }

  const columns = [
    { title: 'Mã SP', dataIndex: 'id', key: 'id',  render: (text) => (
      <div className="max-w-10 overflow-hidden text-ellipsis whitespace-nowrap">
        {text}
      </div>
    ), },
    { 
      title: 'Ảnh SP', 
      dataIndex: 'mainImage', 
      key: 'mainImage',
      render: (text, record) => (
        <img src={record.mainImage} alt={record.name} style={{ width: '100px', height: 'auto' }} />
      ),
    },
    { title: 'Giá Tiền', dataIndex: 'new_price', key: 'new_price' },
    { title: 'Số Lượng', dataIndex: 'number', key: 'number' },
    { 
      title: 'Mô Tả', 
      dataIndex: 'describe', 
      key: 'describe',
      render: (text) => (
        <div className="max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {text}
        </div>
      ),
    },
    {
      title: 'CRUD',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            className="text-yellow-500" 
            onClick={() => showModal(record._id)}         
          />
          <Button icon={<InfoCircleOutlined />} />
          <Button icon={<DeleteOutlined />} onClick={() => showDeleteModal(record._id)} className="text-red-500" />
        </Space>
      ),
    },
  ];

  const formattedData = products.map(product => ({
    key: product.id,
    _id: product._id,
    id: product.id,
    mainImage: product.mainImage,
    new_price: product.new_price,
    number: product.number,
    describe: product.describe,
  }));

  return (
    <div className='px-[10px] pt-[1px] bg-[#F8F9FC] pb-[40px]'>
      <div className='flex justify-between max-w-full items-center p-[10px] mt-2'>
        <div className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">Tất cả sản phẩm</div>
       <div className='flex gap-2'>
       <div className="relative pb-2.5">
    <FaSearch className="text-[#9c9c9c]  absolute top-1/4 left-3"/>
      <input
        type="text"
        className="pl-10 bg-[#E7E7E7] h-[40px] text-white outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
        placeholder="Tìm kiếm"
      />
    </div>
        <Button 
          type="danger" 
          onClick={() => showModal()} 
          htmlType="submit" 
          className="bg-orange-600 hover:bg-orange-400 text-white mt-1"
        >
          <PlusOutlined /> Thêm Sản Phẩm
        </Button>
        </div>
      </div>

      <Table className='border-2 my-2' columns={columns} dataSource={formattedData} pagination={{
        pageSize: 4,
        total: products.length,
      }}/>

      <ModalDelete 
        open={isDeleteModalVisible} 
        onClose={handleCancel} 
        onConfirm={async () => {
          try {
            const response = await axios.delete(`http://localhost:4000/productList/deleteProduct/${selectedProductId}`);
            if (response.data.message === 'Product deleted successfully') {
              notification.success({
                message: 'Product Deleted Successfully',
                description: 'The product has been deleted successfully!',
              });
              handleCancel();
            } else {
              notification.error({
                message: 'Product Deletion Failed',
                description: 'Product deletion failed!',
              });
            }
          } catch (error) {
            const errorMessage = error.response?.data?.message || "An unknown error occurred.";
            notification.error({
              message: 'Product Deletion Failed',
              description: errorMessage,
            });
          }
        }}
      />
  
      <CreateProduct 
        visible={isModalVisible} 
        handleCancel={handleCancel} 
        header={header} 
        data={selectedProductId}
        onFinish={onFinishHandler}
        onClose={onClose}
      />
    </div>
  );
}

export default ProductAdmin;
