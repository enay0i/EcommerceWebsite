import React, { useState,useEffect } from 'react';
import { Table, Alert, Button, Space, notification,Select } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined,UnorderedListOutlined,ArrowsAltOutlined,MenuUnfoldOutlined } from '@ant-design/icons';
import ModalDelete from '../modalz';
import axios from 'axios';
import CreateProduct,{AddProduct} from './AddProduct';
import { FaSearch } from "react-icons/fa";
const ProductAdmin = ({token}) => {
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [header, setHeader] = useState("");
  const [onFinishHandler, setOnFinishHandler] = useState("");
  const [errMessage, setErrMessage] = useState('');  
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [visible, setVisible] = useState(false);
  const [isSize, setIsSize] = useState('');
const handleAddClick = (type) => {
  setVisible(true);
  setIsSize(type);
};
  const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/productList/products",{
        headers: {
          token: token, 
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:4000/productList/category");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);
  
  const showModal = (productId) => {
    if (productId) {
      setSelectedProductId(productId); 
      setHeader("Sửa Sản Phẩm");

      setOnFinishHandler(() => (values) => onFinishUpdate(values, productId)); 
    } else {
      setSelectedProductId(null);
      setHeader("Thêm Sản Phẩm");
      setOnFinishHandler(() => onFinishCreate);
    }
    setIsModalVisible(true);
  };
  


  const onFinishUpdate = async (values,id) => {
    const imgArray = values.additionalImages || [];
    try {
      const response = await axios.post(`http://localhost:4000/productList/updateProduct/${id}`, {
        ...values,
        additionalImages: imgArray,
    }, {
        headers: {
            token: token, 
        },
    });
      if (response.data.status === 'OK') {
        notification.success({
          message: 'Cập Nhật Sản Phẩm Thành Công',
          description: 'Sản phẩm đã được cập nhật thành công!',
        });
        fetchProducts();
        handleCancel(); 
      } else {
        setErrMessage('Cập Nhật Sản Phẩm Thất Bại!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Cập Nhật Sản Phẩm Thất Bại',
        description: errorMessage,
      });
      setErrMessage(errorMessage); 
    }
  };


  const onFinishCreate = async (values) => {
    const imgArray = values.additionalImages || [];
   
  
    if (values.new_price < 1000) {
      notification.error({
        message: "Giá tiền phải lớn hơn 1000"
      });
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:4000/productList/createProduct', {
        ...values,
        additionalImages: imgArray,
      }, {
        headers: {
          token: token,
        },
      });
      notification.success({
        message: 'Tạo Sản Phẩm Thành Công',
        description: 'Sản phẩm mới đã được thêm vào!',
      });
      fetchProducts();
      handleCancel();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Tạo sản phẩm thất bại',
        description: errorMessage,
      });
      setErrMessage(errorMessage);
    }
  };
  

  const showDeleteModal = (productId) => {
    setSelectedProductId(productId);
    setIsDeleteModalVisible(true);
  };

  const handleCancel = () => {
    setIsDeleteModalVisible(false);
    setIsModalVisible(false); 
    setSelectedProductId(null);  
  };

  



  const columns = [
    { title: 'Tên SP', dataIndex: 'name', key: 'name' },
     { 
      title: 'Ảnh SP', 
      dataIndex: 'additionalImages', 
      key: 'additionalImages',
      render: (text, record) => (
        <img src={record.additionalImages} alt={record.name} style={{ width: '100px', height: 'auto' }} />
      ),
    },
    { title: 'Giá Tiền', dataIndex: 'new_price', key: 'new_price',
      render: (text) => (
        <div className="max-w-sm overflow-hidden text-ellipsis whitespace-nowrap">
          {formatToVND(text)}
        </div>
      ), },
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
      title: 'Tùy Chọn',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            className="text-yellow-500" 
            onClick={() => showModal(record._id)}         
          />
          <Button icon={<DeleteOutlined />} onClick={() => showDeleteModal(record._id)} className="text-red-500" />
        </Space>
      ),
    },
  ];

  const formattedData = products
  .map(product => ({
    key: product._id,
    _id: product._id,
    name: product.name,
    new_price: product.new_price,
    describe: product.describe,
    additionalImages: product.additionalImages[0],
    categoryID: product.categoryID,
  }))
  .filter(product =>
    (product.name && product.name.toLowerCase().includes(searchText.toLowerCase())) &&
    (!selectedCategory || product.categoryID.includes(selectedCategory))
  );

  return (
    <div className='px-[10px] pt-[1px] h-full bg-[#F8F9FC]'>
      <div className='flex justify-between max-w-full items-center p-[10px] mt-2'>
        <div className="text-[28px] text-left leading-[34px] font-normal text-[#5a5c69] cursor-pointer">Tất cả sản phẩm</div>
       <div className='flex gap-2 mt-2'>
       <Select
            placeholder="Chọn danh mục"
            onChange={(value) => setSelectedCategory(value)}
            style={{ width: 150 }}
            allowClear
            className='mt-1'
          >
            {categories.map(category => (
              <Select.Option key={category._id} value={category._id}>
                {category.cateName}
              </Select.Option>
            ))}
          </Select>
          
        <div className="relative pb-2.5">
    <FaSearch className="text-[#9c9c9c]  absolute top-1/4 left-3"/>
      <input
        type="text"
        className="pl-10 bg-[#E7E7E7] h-[40px] text-black outline-none w-[300px] rounded-[5px] placeholder:text-[14px] leading-[20px] font-normal"
        placeholder="Tìm kiếm"
        value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
    
        </div>
        <div className = "group fixed bottom-0 right-0 p-2 z-50 flex items-end justify-end w-20 h-20 ">
    <div onClick={()=>showModal()} className="text-white shadow-xl flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-black to-gray-700 z-50 absolute  ">
       <PlusOutlined/>
    </div>
   
    <div
  onClick={() => handleAddClick('category')}
  className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-y-0 group-hover:scale-y-100 group-hover:-translate-x-16 flex p-2 hover:p-3 bg-green-300 scale-100 hover:bg-green-400 text-white cursor-pointer"
>
  <UnorderedListOutlined />
</div>

<div
  onClick={() => handleAddClick('size')}
  className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-16 flex p-2 hover:p-3 bg-blue-300 hover:bg-blue-400 text-white cursor-pointer"
>
  <ArrowsAltOutlined />
</div>

<div
  onClick={() => handleAddClick('subcategory')}
  className="absolute rounded-full transition-all duration-[0.2s] ease-out scale-x-0 group-hover:scale-x-100 group-hover:-translate-y-14 group-hover:-translate-x-14 flex p-2 hover:p-3 bg-yellow-300 hover:bg-yellow-400 text-white cursor-pointer"
>
<MenuUnfoldOutlined />
</div>
    
</div>
<AddProduct
        type={isSize}
        visible={visible}
        onCancel={() => {setVisible(false),setIsSize("")}}
        token={token}
      />
      </div>

      <Table
  className='border-2 my-2'
  columns={columns}
  dataSource={formattedData}
  pagination={{
    pageSize: 4,
    total: products.length,
  }}
  scroll={{
    x: 1000, 
  }}
/>

<ModalDelete 
  open={isDeleteModalVisible} 
  onClose={handleCancel} 
  header={"sản phẩm"}
  onConfirm={async () => {
    try {
      const response = await axios.delete(`http://localhost:4000/productList/deleteProduct/${selectedProductId}`, {
        headers: {
          token: token, 
        },
      });
      if (response.data.success) {
        notification.success({
          message: 'Xóa Sản Phẩm Thành Công',
          description: 'Sản phẩm đã được xóa thành công!',
        });
        fetchProducts();
        handleCancel();
      } else {
        notification.error({
          message: 'Xóa Sản Phẩm Thất Bại',
          description: 'Xóa sản phẩm thất bại!',
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An unknown error occurred.";
      notification.error({
        message: 'Xóa Sản Phẩm Thất Bại',
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
        token={token}
      />
    </div>
  );
}



export default ProductAdmin;
