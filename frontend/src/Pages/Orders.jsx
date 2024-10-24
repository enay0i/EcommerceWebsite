import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';

const Orders = () => {
  const { products, sizeMap, cartItems } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const itemId in cartItems) {
      for (const sizeId in cartItems[itemId]) {
        const quantity = cartItems[itemId][sizeId];
        if (quantity > 0) {
          tempData.push({
            _id: itemId,
            size: sizeId,
            quantity
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'ĐƠN HÀNG'} text2={'CỦA TÔI'} />
      </div>

      <div>
        {cartData.map((item, index) => {
          const productData = products.find((product) => product._id === item._id);
          
          // Check if the product exists
          if (!productData) {
            console.log("there is no product");
            return null; // Return null if the product doesn't exist
          }

          return (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={productData.mainImage} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{productData.name}</p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg'>{productData.new_price}</p>
                    <p>Số lượng: {item.quantity}</p> {/* Display the actual quantity */}
                    <p>Kích cỡ: {sizeMap[item.size] || 'Unknown Size'}</p> {/* Use sizeMap for the size name */}
                  </div>
                  <p className='mt-2'>Ngày: <span className='text-gray-400'>20, Tháng 10, 2024</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>Sẵn sàng vận chuyển</p>
                </div>
                <button className='border px-4 py-2 text-sm font-medium rounded-sm'>Kiểm tra đơn hàng</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Orders;
