import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2x1 pt-10 border-t'>
        <Title text1={'LIÊN HỆ'} text2={'CHÚNG TÔI'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Cửa hàng của chúng tôi</p>
          <p className='text-gray-500'>666 Su Van Hanh <br /> 666 Su Van Hanh</p>
          <p>SĐT: 666-666 <br />Email: assmin@oioioi.com</p>
          <p className='font-semibold text-xl text-gray-600'>Công việc tại cửa hàng</p>
          <p className='text-gray-500'>Tìm hiểu về chính sách công việc của chúng tôi.</p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Khám phá công việc</button>
        </div>
      </div>


    </div>
  )
}

export default Contact
