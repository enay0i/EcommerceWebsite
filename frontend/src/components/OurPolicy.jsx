import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap text-center py-20 text-xs sm:text-sm md:text-base text-gray-700 '>
     
      <div>
        <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>CHÍNH SÁCH ĐỔI TRẢ</p>
      </div>
      <div>
        <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>CHÍNH SÁCH 7 NGÀY ĐỔI TRẢ</p>
        <p className='text-gray-400'>Chúng tôi đổi trả miễn phí trong 7 ngày</p>
      </div>
      <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
        <p className='font-semibold'>HỖ TRỢ TỐT NHẤT CHO KHÁCH HÀNG</p>
        <p className='text-gray-400'>Hỗ trợ khách hàng 24/7</p>
      </div>
    
    </div>
  )
}

export default OurPolicy
 