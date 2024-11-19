import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import { toast } from 'react-toastify';

const CartTotal = ({ isCart = false,isOrder=false }) => {
    const { delivery_fee, getCartAmount,setDiscount,priceDiscount,price,setVoucherID } = useContext(ShopContext);
    const [voucherCode, setVoucherCode] = useState('');
    const [vouchers, setVouchers] = useState([]);

    const formatToVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };


    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch('http://localhost:4000/orderList/vouchers');
                const data = await response.json();
                setVouchers(data);
            } catch (error) {
                console.error('Error fetching vouchers:', error);
            }
        };
        fetchVouchers();
    }, []);

    const applyVoucher = () => {
        console.log(voucherCode+" adu");
        const voucher = vouchers.find(v => v.name === voucherCode);
        if (voucher) {
            const currentDate = new Date();
            const startDate = new Date(voucher.startDate);
            const endDate = new Date(voucher.endDate);
          
            if (currentDate >= startDate && currentDate <= endDate) {
                setDiscount(voucher.discount);
                setVoucherID(voucher._id)
                toast.success('Áp dụng mã giảm giá thành công');
            } else {
                toast.error('Voucher đã hết thời hạn sử dụng');
            }
        } else {
            toast.error('Voucher không hợp lệ');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            applyVoucher();
        }
    };

  



    return (
        <div className='w-full'>
            <div className='text-2xl'>
                <Title text1={'TỔNG'} />
            </div>

            <div className='flex flex-col gap-2 mt-2 text-sm'>
                <div className='flex justify-between'>
                    <p>Tạm tính</p>
                    <p>{formatToVND(price)}</p>
                </div>
                <hr />
                <div className='flex justify-between'>
                    <p>Phí vận chuyển</p>
                    <p>{formatToVND(delivery_fee)}</p>
                </div>

                {isCart && ( 
                    <div>
                        <hr />
                        <div className='flex justify-between items-center mt-2'>
                            <div className='flex items-center gap-2'>
                                <p>Mã giảm giá:</p>
                                <input
                                    type='text'
                                    placeholder='Nhập mã giảm giá'
                                    className='border px-4 py-2 mr-2'
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    onKeyPress={handleKeyPress} 
                                />
                          
                            </div>
                            <p>{formatToVND(priceDiscount)}</p>
                        </div>
                    </div>
                )}
  {isOrder && ( 
                    <div>
                        <hr />
                        <div className='flex justify-between items-center mt-2 '>
                            <div className='flex items-center'>
                                <p>Giá đã giảm:</p>
                             
                          
                            </div>
                            <p>{formatToVND(priceDiscount)}</p>
                        </div>
                    </div>
                )}
 
                <hr />
                <div className='flex justify-between'>
                    <b>Tổng cộng</b>
                    <b>{formatToVND(getCartAmount())}</b>
                </div>
            </div>
        </div>
    );
};

export default CartTotal;
