import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-440 text-sm'>

        <div>
            <img src={assets.logo} className='mb-5 w-32' alt="" />
            <p className='w-full md:w-2/3 text-gray-600'>
            I am the storm that is approaching
Provoking
Black clouds in isolation
I am reclaimer of my name
Born in flames
I have been blessed
My family crest is a demon of death!
Forsakened, I am awakened
A phoenix's ash in dark divine
Descending misery
Destiny chasing time
            </p>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>CÔNG TY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
            <Link to="/"><li>Trang chủ</li></Link>
                <Link to="/contact"><li>Về chúng tôi</li></Link>
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
