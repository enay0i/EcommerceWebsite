// Product.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { Spin, Alert } from 'antd'; 
import { useGet } from '../hook/hook'; 

const Product = () => {
  const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  const { id } = useParams();
  const { addToCart } = useContext(ShopContext);
  const { data: productData, error, loading } = useGet(`http://localhost:4000/productList/products/${id}`);
  const { data: sizeData, error: sizeError, loading: sizeLoading } = useGet('http://localhost:4000/productList/sizes');
  const [image, setImage] = useState('');
  const [sizeMap, setSizeMap] = useState({});
  const [size, setSize] = useState('');

  useEffect(() => {
    if (sizeData) {
      const map = {};
      sizeData.forEach(item => {
        map[item._id] = item.sizeName;
      });
      setSizeMap(map);
    }
  }, [sizeData]);

  if (loading || sizeLoading) {
    return <Spin size="large" style={{ display: 'block', margin: 'auto' }} />;
  }

  if (error || sizeError) {
    return (
      <Alert
        message="Error"
        description="Failed to load product details."
        type="error"
        showIcon
      />
    );
  }

  if (!productData) {
    return <Alert message="No product data found" type="info" showIcon />;
  }

  return (
    <div className="border-t-2- pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* Product display */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* Product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            <img
              onClick={() => setImage(productData.mainImage)}
              src={productData.mainImage}
              className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
              alt={productData.name}
            />
            {productData.additionalImages.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt={`Additional image ${index + 1}`}
              />
            ))}
          </div>
          <div className="w-full sm:w[80%]">
            <img className="w-full h-auto" src={image || productData.mainImage} alt={productData.name} />
          </div>
        </div>

        {/* Product information */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_icon} alt="Star" className="w-3.5" />
            <img src={assets.star_dull_icon} alt="Star" className="w-3.5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">
       {formatToVND(productData.new_price)}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.describe}</p>

          <div className="flex flex-col gap-4 my-8">
            <p>Chọn Kích Thước</p>
            <div className="flex gap-2">
              {productData.sizeID.map((sizeId, index) => (
                <button
                  onClick={() => setSize(sizeId)}
                  className={`border py-2 px-4 bg-gray-100 ${sizeId === size ? 'border-orange-500' : ''}`}
                  key={index}
                >
                  {sizeMap[sizeId] || 'Unknown'}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            THÊM VÀO GIỎ
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>Sản phẩm giống tới 95% so với ảnh.</p>
            <p>Có sẵn phương thức thanh toán COD.</p>
            <p>Phí ship đồng giá 20k trên toàn quốc.</p>
          </div>
        </div>
      </div>

      {/* Product description and reviews */}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm">Description</b>
          <p className="border px-5 py-3 text-sm">Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quas provident omnis odio, eos unde magni aut nam itaque magnam vero et amet optio nihil, harum rem corrupti rerum qui distinctio.</p>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi cumque molestias provident consectetur velit voluptate corrupti odit quis, quasi cupiditate repellendus iusto voluptates ipsa hic necessitatibus dolor quam ullam repellat!</p>
        </div>
      </div>

      {/* Related products */}
      {productData.categoryID && productData.categoryID.length > 0 && (
        <RelatedProducts category={productData.categoryID[0]} />
      )}
    </div>
  );
};

export default Product;
