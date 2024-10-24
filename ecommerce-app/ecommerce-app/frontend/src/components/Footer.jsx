import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-440 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi debitis quasi culpa nam impedit molestiae sequi accusantium quibusdam sed temporibus dignissimos ullam veritatis, incidunt sunt, repellat, suscipit amet nulla maiores?
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>CÔNG TY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>Trang chủ</li>
                <li>Về chúng tôi</li>
                <li>Vận chuyển</li>
                <li>Chính sách bảo mật</li>
            </ul>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>LIÊN HỆ</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>666-666-666</li>
                <li>contact@oioioi.com</li>
            </ul>
        </div>

        </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ oioioi.com - All Right Reserved</p>
        </div>

    </div>
  )
}

export default Footer
