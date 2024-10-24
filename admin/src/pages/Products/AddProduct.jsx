import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Form, Input, Button, Select, notification, Row, Col, Spin, Alert, Modal } from 'antd';
import { useGet } from "../../hook/hook";

const { Option } = Select;

const CreateProduct = ({ visible, handleCancel, data, header, onFinish, onClose }) => {
  const { id } = useParams(); 
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState('');
  const [loadingProduct, setLoadingProduct] = useState(false);


  const { data: size, error: sizeerror, loading: sizeload } = useGet("http://localhost:4000/productList/sizes");
  const { data: category, error: cateerror, loading: cateload } = useGet("http://localhost:4000/productList/category");


  useEffect(() => {
    if (data) {  
      setLoadingProduct(true);
      axios
        .get(`http://localhost:4000/productList/products/${data}`)
        .then((response) => {
          const productData = response.data;
  
          form.setFieldsValue({
            ...productData,
            additionalImages: productData.additionalImages ? productData.additionalImages.join(", ") : "",
          });
        })
        .catch((error) => {
          setErrMessage('Failed to load product details.');
        })
        .finally(() => {
          setLoadingProduct(false);
        });
    } else {
      form.resetFields(); 
    }
  }, [data]);
  

  if (sizeload || cateload || loadingProduct) {
    return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
  }

  if (sizeerror || cateerror) {
    return (
      <Alert
        message="Error"
        description="Failed to load sizes or categories."
        type="error"
        showIcon
      />
    );
  }

  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      footer={null}
    >
      <Form
        form={form}
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 20 }}
        name="createProduct"
        className="py-8 h-auto"
        onFinish={onFinish}
      >
        <h1 className="text-xl font-bold mb-10 text-orange-600 text-center">{header}</h1>
        {errMessage && <div className="text-red-500">{errMessage}</div>}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mã SP"
              name="id"
              rules={[{ required: true, message: 'Please input Mã SP!' }]}
            >
              <Input placeholder="Mã SP" />
            </Form.Item>

            <Form.Item
              label="Tên SP"
              name="name"
              rules={[{ required: true, message: 'Please input Tên SP!' }]}
            >
              <Input placeholder="Tên SP" />
            </Form.Item>

            <Form.Item
              label={<span className="text-black">Giá Tiền</span>}
              name="new_price"
              rules={[{ required: true, message: 'Please input new price!' }]}
            >
              <Input type="number" placeholder="Giá Mới" />
            </Form.Item>

            <Form.Item
              label={<span className="text-black">Giá Gốc</span>}
              name="old_price"
              rules={[{ required: true, message: 'Please input old price!' }]}
            >
              <Input type="number" placeholder="Giá Gốc" />
            </Form.Item>

            <Form.Item
              label={<span className="text-black">Số lượng</span>}
              name="number"
              rules={[{ required: true, message: 'Please input Số Lượng!' }]}
            >
              <Input type="number" placeholder="Số Lượng" />
            </Form.Item>

            <Form.Item
              label={<span className="text-black">Mô Tả</span>}
              name="describe"
              rules={[
                { required: true, message: 'Please input description!' },
                { min: 10, message: 'Description should be at least 10 characters long!' },
              ]}
            >
              <Input.TextArea placeholder="Mô Tả Sản Phẩm" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span className="text-black">Danh mục</span>}
              name="categoryID"
              rules={[{ required: true, message: 'Please select category!' }]}
            >
              <Select mode="multiple" placeholder="Chọn danh mục">
                {category.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.cateName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-black">Kích Cỡ</span>}
              name="sizeID"
              rules={[{ required: true, message: 'Please select size!' }]}
            >
              <Select mode="multiple" placeholder="Chọn kích cỡ">
                {size.map((size) => (
                  <Option key={size._id} value={size._id}>
                    {size.sizeName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<span className="text-black">Ảnh Chính</span>}
              name="mainImage"
              rules={[
                { required: true, message: 'Please input Main Image URL!' },
                { type: 'url', message: 'Please enter a valid URL!' },
              ]}
            >
              <Input placeholder="Main Image URL" />
            </Form.Item>

            <Form.Item
              label={<span className="text-black">Các Ảnh Phụ</span>}
              name="additionalImages"
              rules={[{ required: false, message: 'Please enter additional images URLs!' }]}
            >
              <Input.TextArea placeholder="Comma separated URLs for additional images" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 23 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="danger"
              htmlType="submit"
              className="bg-orange-600 hover:bg-orange-400 text-white"
            >
              {header}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProduct;
