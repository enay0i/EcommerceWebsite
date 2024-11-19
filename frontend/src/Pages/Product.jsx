import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { Spin, Alert } from 'antd';
import { useGet } from '../hook/hook';
import { toast } from 'react-toastify';
import axios from 'axios';

const Product = () => {
  const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  const { id } = useParams();
  const { addToCart, getUserIdFromToken,token } = useContext(ShopContext);
  const { data: productData, error, loading } = useGet(`http://localhost:4000/productList/products/${id}`);
  const { data: sizeData, error: sizeError, loading: sizeLoading } = useGet('http://localhost:4000/productList/sizes');
  
  const [image, setImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/productList/comments/${id}`);
      setComments(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Failed to load orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const averageRating = comments.length > 0
    ? comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length
    : 0;  
  const roundedRating = Math.ceil(averageRating);

  const handleCommentSubmit = async () => {
    if (!commentText.trim() || !selectedSize) {
      toast.error('Vui lòng chọn đánh giá và bình luận!');
      return;
    }

    const newComment = {
      content: commentText,
      rate: selectedSize,
      cusID: getUserIdFromToken(),
      productID: productData._id,
    };
    try {
      const response = await axios.post('http://localhost:4000/productList/addcomment', newComment);
      if (response.data.success) {
        toast.success('Bình luận cho sản phẩm thành công');
        fetchOrders();
        setCommentText('');
        setSelectedSize('');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting comment:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'An unknown error occurred');
    }
  };

  const handleSizeSelection = (sizeId, quantity) => {
    setSelectedSize(sizeId);
    setSelectedQuantity(quantity);
    console.log(selectedSize +" damedane")
  };
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Vui lòng chọn kích thước!');
      return;
    }
  
    const selectedSizeData = productData.size.find(item => item.sizeID._id === selectedSize);
  
    if (selectedSizeData && selectedSizeData.quantity > 0) {
      addToCart(productData._id, selectedSize);
    } else {
      toast.error('Kích thước không có sẵn!');
    }
  };
  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full h-[500px]">
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
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto mt-2" src={image || productData.additionalImages[0]} alt={productData.name} />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(roundedRating)].map((_, index) => (
              <img
                src={assets.star_icon}
                alt="Star"
                className={`w-3.5 ${index < roundedRating ? 'text-yellow-500' : 'text-gray-400'}`}
                key={index}
              />
            ))}
            <p className="pl-2">({comments.length > 0 ? comments.length : 0})</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{formatToVND(productData.new_price)}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productData.describe}</p>

          <div className="flex flex-col gap-4 my-8">
            <p>Chọn Kích Thước</p>
            <div className="flex gap-2">
              {productData.size.map(({ sizeID, quantity }, index) => (
                <button
                  onClick={() => handleSizeSelection(sizeID._id, quantity)}
                  className={`border py-2 px-4 bg-gray-100 ${sizeID._id === selectedSize ? 'border-orange-500' : ''}`}
                  key={index}
                >
                  {sizeID.sizeName || 'Unknown'}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => addToCart(productData._id, selectedSize)}
            className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 ${selectedQuantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={selectedQuantity === 0}
          >
            {selectedQuantity === 0 ? 'HẾT HÀNG' : 'THÊM VÀO GIỎ'}
          </button>
          
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>Sản phẩm giống tới 95% so với ảnh.</p>
            <p>Có sẵn phương thức thanh toán COD.</p>
            <p>Phí ship đồng giá 20k trên toàn quốc.</p>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex">
          <b
            onClick={() => handleTabChange('description')}
            className={`border px-5 py-3 text-sm cursor-pointer ${activeTab === 'description' ? 'bg-gray-200' : ''}`}
          >
            Mô Tả
          </b>
          <p
            onClick={() => handleTabChange('reviews')}
            className={`border px-5 py-3 text-sm cursor-pointer ${activeTab === 'reviews' ? 'bg-gray-200' : ''}`}
          >
            Bình Luận ({comments.length})
          </p>
        </div>

        {activeTab === 'description' ? (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p>{productData.describe}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
        {comments && comments.length > 0 ? (
  comments.map((comment, index) => (
    <div key={index} className="border-b pb-6 mb-6">
      <div className="flex items-center mb-2 justify-between">
        <div className="flex items-center">
          <span className="font-semibold text-lg mr-2">{comment.cusID.name}</span>
          <div className="flex">
            {[...Array(comment.rate)].map((_, i) => (
              <span key={i} className="text-yellow-500">★</span>
            ))}
          </div>
        </div>
        <span className="text-sm text-gray-500">{new Date(comment.dateCreate).toLocaleDateString()}</span>
      </div>
      <p className="text-gray-800 text-sm">{comment.content}</p>
    </div>
  ))
) : (
  <p className="text-gray-500 italic text-xl">Chưa có đánh giá nào, hãy là người tiên phong !!!</p>
)}
            
            <textarea
              className="border p-2 w-full mt-4"
              placeholder="Nhập bình luận của bạn tại đây"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)} 
            ></textarea>

<div className="flex mt-2 items-center justify-center">
  {[1, 2, 3, 4, 5].map((star) => (
    <button
      key={star}
      className={`text-2xl px-2 py-1 ${selectedSize >= star ? 'text-yellow-500' : 'text-gray-400'}`}
      onClick={() => setSelectedSize(star)}
    >
      ★
    </button>
  ))}
</div>


            <button
  className="bg-black text-white px-6 py-3 mt-4 rounded-lg shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-300"
  onClick={handleCommentSubmit}
>
  Gửi Đánh Giá
</button>
          </div>
        )}
      </div>

      <RelatedProducts />
    </div>
  );
};

export default Product;
