import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';

const CartTotal = () => {

    const {delivery_fee,getCartAmount } = useContext (ShopContext);
    const formatToVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(amount);
      };
  return (
    <div className='w-full'>
       <div className='text-2x1'>
        <Title text1={'TỔNG'}/>
       </div>

        <div className='flex flex-col gap-2 mt-2 text-sm'>
            <div className='flex justify-between'>
                <p>Tạm tính</p>
                <p>{formatToVND(getCartAmount())}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>Phí vận chuyển</p>
                <p>{formatToVND(delivery_fee)}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <b>Tổng cộng</b>
                <b>{formatToVND(getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee)}</b>
            </div>
        </div>
    </div>
  )
}

export default CartTotal
