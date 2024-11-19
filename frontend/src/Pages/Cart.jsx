// Cart.jsx
import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import {toast} from 'react-toastify'
import { Link } from 'react-router-dom';
const Cart = () => {
  const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };
  const { products, sizeMap, cartItems, updateQuantity, navigate } = useContext(ShopContext);
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        if(products.length>0){
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
    }
    }, [cartItems,products]);

    
    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text1={'YOUR CART'} text2={''} />
            </div>
          
            <div>
            {cartData.map((item, index) => {
    const productData = products.find((product) => product._id === item._id);
    
    if (!productData) {
        return null; 
    }
    const selectedSize = productData.size.find(size => size.sizeID._id === item.size); 
    return (
        <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
            <div className='flex items-start gap-6'>
                <Link to={`/product/${productData._id}`}>
                    <img className='w-16 sm:w-20' src={productData.additionalImages[0]} alt={productData.name} />
                </Link> 
                <div>
                    
                    <p className='text-xs sm:text-lg font-medium'>{productData.name}</p>
                    <div className='flex items-center gap-5 mt-2'>
                        <p>{formatToVND(productData.new_price)}</p>
                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>
                            {selectedSize ? selectedSize.sizeID.sizeName : 'Unknown Size'}
                        </p>
                    </div>
                </div>
            </div>
            <input
                onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value > 0) {
                        updateQuantity(item._id, item.size, value);
                    }
                }}
                className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1'
                type="number"
                min={1}
                defaultValue={item.quantity}
            />
            <img onClick={() => updateQuantity(item._id, item.size, 0)} className='w-4 mr-4 sm:w-5 cursor-pointer' src={assets.bin_icon} alt="Remove" />
        </div>
    );
})}

            </div>

           <div className='flex justify-end my-20'>
    <div className='w-full sm:w-[450px]'>
        <CartTotal isCart={true} />
        
        <div className='w-full text-end'>
           
        <button 
    onClick={() => {
        if (cartData.length === 0) {
            toast.error("Giỏ hàng của bạn đang trống");
        } else {
            navigate('/place-order');
        }
    }}
    className='bg-black text-white text-sm my-8 px-8 py-3'
>
    THANH TOÁN
</button>

        </div>
    </div>
</div>

        </div>
    );
}

export default Cart;