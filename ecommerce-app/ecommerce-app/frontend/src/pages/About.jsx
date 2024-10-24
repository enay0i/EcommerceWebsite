import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      
      <div className='text-2x1 text-center pt-8 border-t'>
        <Title text1={'VỀ'} text2={'CHÚNG TÔI'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray 600'>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Hic ducimus maiores, omnis tenetur animi eaque quam architecto delectus! Ipsa saepe expedita ut maxime pariatur rerum labore quam alias voluptatum animi?</p>
              <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur possimus tempore perspiciatis atque amet, inventore repellat consectetur odit veniam sunt illum ut repellendus consequatur, ab dolor ducimus rem maiores delectus!</p>
              <b className='text-gray-800'>Mục tiêu của chúng tôi</b>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nemo accusamus nisi, eveniet laboriosam corporis sapiente adipisci temporibus, consequuntur ea culpa quae voluptatum delectus natus? Saepe unde autem minus. Omnis, modi!</p>
          </div>
      </div>
      <div className='text-4x1 py-4'>
          <Title text1={'TẠI SAO'} text2={'NÊN LỰA CHỌN CHÚNG TÔI'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Đảm bảo chất lượng:</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi unde ipsa atque delectus, natus dicta consequatur. Vero, voluptatum ut, eligendi ea in optio quasi ipsa asperiores porro, impedit nisi mollitia?</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Tiện lợi:</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi unde ipsa atque delectus, natus dicta consequatur. Vero, voluptatum ut, eligendi ea in optio quasi ipsa asperiores porro, impedit nisi mollitia?</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Dịch vụ khách hàng đặc biệt:</b>
          <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi unde ipsa atque delectus, natus dicta consequatur. Vero, voluptatum ut, eligendi ea in optio quasi ipsa asperiores porro, impedit nisi mollitia?</p>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default About
