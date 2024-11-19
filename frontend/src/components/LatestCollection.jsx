import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
  const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
    const { products } = useContext(ShopContext);
    const [latestProducts, setLatestProducts] = useState([]);

    useEffect(()=>{
        setLatestProducts(products.slice(0,10)); 
    },[])

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3x1'>
            <Title text1={'BÁN CHẠY NHẤT'} text2={'BỘ SƯU TẬP'} />
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text:gray-600'>
            Đây là bộ sưu tập mới nhất của SHOP, cảm ơn các bạn đã ủng hộ
            </p>
        </div>
      
        {/* render San pham  */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {
            latestProducts.map((item,index)=>(
              <ProductItem key={index} id={item._id} image={item.additionalImages[0]} name={item.name} price={formatToVND(item.new_price)} />
            ))
          }
        </div>

    </div>
  )
}

export default LatestCollection
