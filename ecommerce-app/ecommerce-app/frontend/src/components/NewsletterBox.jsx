import React from 'react'

const NewsletterBox = () => {

    const onSubmitHandler =()=>{
        event.preventDefault();
    }

  return (
    <div className='text-center'>
        <p className='text-2x1 font-medium text-gray-800 '>ĐĂNG KÍ NGAY VÀ NHẬN GIẢM GIÁ 20%</p>
        <p className='text-gray-400 mt-3'>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sequi optio porro, ipsa laboriosam error et voluptatibus quis! Molestias nulla ad consequatur sequi voluptatum ipsum quaerat voluptates ratione, saepe, aut ipsam?
        </p>
        <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 '>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='Nhập Email của bạn' required/>
            <button type='submit' className='bg-black text-white text-xs px-10 py-4'>ĐĂNG KÍ</button>
        </form>
    </div>
  )
}

export default NewsletterBox