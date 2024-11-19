  import React, { useState, useEffect } from 'react';
  import { useNavigate, useParams } from 'react-router-dom';
  import axios from 'axios';
  import { Form, Input, Button, Select, notification, Row, Col, Spin, Alert, Modal,Upload } from 'antd';
  import { useGet } from "../../hook/hook";
  import { MinusOutlined ,PlusOutlined} from '@ant-design/icons';
  const { Option } = Select;

  const CreateProduct = ({ visible, handleCancel, data, header, onFinish, token }) => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [errMessage, setErrMessage] = useState('');
    const [loadingProduct, setLoadingProduct] = useState(false);
    const [sizeFields, setSizeFields] = useState([]);
  
    const { data: size, error: sizeError, loading: sizeLoad } = useGet("http://localhost:4000/productList/sizes");
    const { data: category, error: cateError, loading: cateload } = useGet("http://localhost:4000/productList/category");
    const { data: subcategory, error: subCateError, loading: subCateload } = useGet("http://localhost:4000/productList/subcategory");
  
    useEffect(() => {
      if (data) {
        setLoadingProduct(true);
        axios
          .get(`http://localhost:4000/productList/products/${data}`, {
            headers: {
              token: token,
            },
          })
          .then((response) => {
            const productData = response.data;
    
            console.log('Product Data:', productData);  // Log the data for debugging
    
            // Prepare size fields
            const sizeData = productData.size.map((item) => ({
              sizeID: item.sizeID._id,  // Ensure we're using the correct ID
              quantity: item.quantity,
            }));
    
            // Set form values
            form.setFieldsValue({
              name: productData.name,
              new_price: productData.new_price,
              describe: productData.describe,
              categoryID: productData.categoryID, 
              subcategoryID: productData.subcategoryID,
              additionalImages: productData.additionalImages.join(","),
              size: sizeData, 
            });
    
            setSizeFields(sizeData);  // Save the size data
    
          })
          .catch((error) => {
            setErrMessage('Failed to load product details.');
            console.error('Error loading product details:', error);
          })
          .finally(() => {
            setLoadingProduct(false);
          });
      } else {
        form.resetFields();
        setSizeFields([]);
      }
    }, [data, token, form]);
    
    
    
    
    
  
    if (sizeLoad || cateload || loadingProduct || subCateload) {
      return <Spin size="large" style={{ display: "block", margin: "auto" }} />;
    }
  
    if (sizeError || cateError || subCateError) {
      return (
        <Alert
          message="Error"
          description="Failed to load sizes or categories."
          type="error"
          showIcon
        />
      );
    }
    const handleUploadChange = async ({ fileList }) => {
      const images = fileList.map((file) => file.response?.secure_url);
      form.setFieldsValue({ additionalImages: images }); 
    };
    
    const uploadProps = {
      name: 'file',
      action: 'https://api.cloudinary.com/v1_1/dl5epe8p1/image/upload', 
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
      data: {
        upload_preset: 'buk9rpaa', 
      },
      onChange: handleUploadChange,
      multiple: true,
      showUploadList: true,
    };
    const addField = () => {
      setSizeFields([...sizeFields, { sizeID: '', quantity: '' }]);
    };
  
    const sizeChange = (index, field, value) => {
      const newSizeFields = [...sizeFields];
      newSizeFields[index][field] = value;
      setSizeFields(newSizeFields);
      form.setFieldsValue({ size: newSizeFields });
    };
    
  
    const removeField = (index) => {
      const newSizeFields = [...sizeFields];
      newSizeFields.splice(index, 1);
      setSizeFields(newSizeFields);
      form.setFieldsValue({ size: newSizeFields });
    };
  
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
          onFinish={(values) => onFinish({ ...values, size: sizeFields })}
        >
          <h1 className="text-xl font-bold mb-10 text-black text-center">{header}</h1>
          {errMessage && <div className="text-red-500">{errMessage}</div>}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên SP"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
              >
                <Input placeholder="Tên SP" />
              </Form.Item>
              <Form.Item
                label={<span className="text-black">Giá Tiền</span>}
                name="new_price"
                rules={[{ required: true, message: 'Vui lòng nhập giá tiền' }]}
              >
                <Input type="number" placeholder="Giá Mới" />
              </Form.Item>
              <Form.Item
                label={<span className="text-black">Mô Tả</span>}
                name="describe"
                rules={[{ required: true, message: 'Vui lòng nhập mô tả' }, { min: 10, message: 'Mô tả phải có độ dài trên 10 ký tự' }]}
              >
                <Input.TextArea placeholder="Mô Tả Sản Phẩm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<span className="text-black">Danh mục</span>}
                name="categoryID"
                rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
              >
                <Select mode="multiple" placeholder="Chọn danh mục">
                  {category.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.cateName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label={<span className="text-black">Loại</span>}
                name="subcategoryID"
                rules={[{ required: true, message: 'Vui lòng chọn loại' }]}
              >
                <Select placeholder="Chọn loại">
                  {subcategory.map((sub) => (
                    <Option key={sub._id} value={sub._id}>
                      {sub.subcateName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

            </Col>
          </Row>
  
          {/* Size Selection */}
          <div className="mr-20">
            <Form.Item label={<span className="text-black">Kích Cỡ</span>}   rules={[{ required: true, message: 'Thêm hình ảnh' }]}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                {sizeFields.map((field, index) => {
                  const selectedSizes = sizeFields
                    .filter((_, i) => i !== index)
                    .map((item) => item.sizeID);
  
                  return (
                    <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Select
                        placeholder="Chọn kích cỡ"
                        value={field.sizeID}
                        onChange={(value) => sizeChange(index, 'sizeID', value)}
                        style={{ width: '60%' }}
                      >
                        {size
                          .filter((s) => !selectedSizes.includes(s._id))
                          .map((s) => (
                            <Option key={s._id} value={s._id}>
                              {s.sizeName}
                            </Option>
                          ))}
                      </Select>
                      <Input
                        type="number"
                        placeholder="Số lượng"
                        value={field.quantity}
                        onChange={(e) => sizeChange(index, 'quantity', e.target.value)}
                        style={{ width: '100%' }}
                      />
                      <Button onClick={() => removeField(index)}>-</Button>
                    </div>
                  );
                })}
                <Button onClick={addField} icon={<PlusOutlined />}>Thêm Kích Cỡ</Button>
              </div>
            </Form.Item>
            <Form.Item
  label="Các Ảnh Phụ"
  name="additionalImages"
  rules={[{ required: true, message: 'Thêm hình ảnh' }]}>
  <Upload
    {...uploadProps}
    listType="picture-card"
    showUploadList={{ showPreviewIcon: true }}
   initialValues={form.getFieldValue('additionalImages')} 
  >
    <Button icon={<PlusOutlined />}>Chọn Hình Ảnh</Button>
  </Upload>
</Form.Item>

          </div>
  
          <Form.Item wrapperCol={{ span: 23 }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="danger" htmlType="submit" className="bg-black hover:bg-gray-400 text-white">
                {header}
              </Button>
            </div>
          </Form.Item>
  
        </Form>
      </Modal>
    );
  };
  
  
  
  export const AddProduct = ({ type, visible, onCancel,token }) => {
    const [fields, setFields] = useState(['']);
    const [loading, setLoading] = useState(false);
  
    const handleAddField = () => {
      setFields([...fields, '']);
    };
  
    const handleFieldChange = (index, value) => {
      const newFields = [...fields];
      newFields[index] = value;
      setFields(newFields);
    };
  
    const handleRemoveField = (index) => {
      const newFields = fields.filter((_, i) => i !== index);
      setFields(newFields);
    };
  
    const handleSubmit = async () => {
      setLoading(true);
      let apiUrl, fieldLabel; 
      try {
       
  
        switch (type) {
          case 'size':
            apiUrl = 'http://localhost:4000/productList/addsize';
            fieldLabel = 'Kích Cỡ';
            break;
          case 'category':
            apiUrl = 'http://localhost:4000/productList/addcategory';
            fieldLabel = 'Danh Mục';
            break;
          case 'subcategory':
            apiUrl = 'http://localhost:4000/productList/addsubcategory';
            fieldLabel = 'Loại';
            break;
          default:
            throw new Error('Invalid type');
        }
  
        const responses = await Promise.all(
          fields.map(field => axios.post(apiUrl, {  [type === 'size' ? 'sizeName' : type ==='category'? 'cateName': 'subcateName']: field }, {
            headers: {
              token: token,
            },
          }))
        );
  
        notification.success({
          message: `${fieldLabel} Đã Được Thêm Thành Công`,
          description: `Đã thêm ${responses.length} ${fieldLabel}`,
        });
  
        setFields(['']);
        onCancel();
      } catch (error) {
        notification.error({
          message: 'Error',
          description: `Failed to add ${fieldLabel}: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Modal visible={visible} onCancel={onCancel} footer={null}>
        <Form onFinish={handleSubmit} layout="vertical">
          {fields.map((field, index) => (
            <Form.Item
              key={index}
              label={`Tên ${type === 'size' ? 'Kích Cỡ' : type === 'category' ? 'Danh Mục' : 'Danh Mục Con'}`}
              name={`field_${index}`}
              rules={[{ required: true, message: `Vui lòng nhập tên ${type === 'size' ? 'kích cỡ' : type === 'category' ? 'danh mục' : 'danh mục con'}` }]}
            >
              <div className='flex'>
                <Input
                  value={field}
                  onChange={(e) => handleFieldChange(index, e.target.value)}
                  placeholder={`Nhập tên ${type === 'size' ? 'kích cỡ' : type === 'category' ? 'danh mục' : 'danh mục con'}`}
                />
                {fields.length > 1 && (
                  <Button onClick={() => handleRemoveField(index)} className='border-none'>
                    <MinusOutlined />
                  </Button>
                )}
              </div>
            </Form.Item>
          ))}
          <div className='items-center text-center justify-center'>
            <Button type="dashed" onClick={handleAddField} className=' mb-[16px]'>
              Thêm Trường
            </Button>
            <Form.Item>
              <Button htmlType="submit" loading={loading} className='text-center bg-black hover:bg-gray-500 text-white'>
                Thêm {type === 'size' ? 'kích cỡ' : type === 'category' ? 'danh mục' : 'danh mục con'}
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  };
  
  

export default CreateProduct;
