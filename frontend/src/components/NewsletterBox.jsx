import React, { useState } from 'react';
import axios from 'axios'
import { toast } from 'react-toastify';
const NewsletterBox = () => {
  const [email, setEmail] = useState('');
  const onSubmitHandler = async (event) => {
    event.preventDefault();
await axios.post('http://localhost:4000/api/email/send-email', {
      email:email
      })
        toast.success('Gửi mail thành công!');
      }
  

  return (
    <div className="text-center">
      <p className="text-2xl font-medium text-gray-800">
        ĐĂNG KÍ NGAY VÀ NHẬN GIẢM GIÁ 20%
      </p>
      <p className="text-gray-400 mt-3">
    Kìa màn đêm, hiu hắt mang tên em, quay về trong kí ức, của anh qua thời gian. Chiều lặng im, nghe gió đung đưa cây, như là bao nỗi nhớ, cuốn anh trôi về đâu. Này gió, đứng hát và bao nỗi nhớ chạy đi, quên âu lo quên hết suy tư một đời.
      </p>
      <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3 ">
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Nhập Email của bạn"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="bg-gray text-white text-xs px-10 py-4">
          ĐĂNG KÍ
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
