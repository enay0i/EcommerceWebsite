import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import beachIntroVideo from '../assets/video/beach-intro.mp4';
const About = () => {
  return (
    <div>
      
      <div className='text-2x1 text-center pt-8 border-t'>
        <Title text1={'VỀ'} text2={'CHÚNG TÔI'}/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
          <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray 600'>
              <p>Tại OIOIOI, chúng tôi tin rằng thời trang không chỉ là trang phục, mà còn là cách thể hiện bản thân.</p>
              <p>OIOIOI ra đời với mục tiêu mang đến cho bạn những thiết kế hiện đại, phong cách và chất lượng, giúp bạn tự tin hơn mỗi ngày. Chúng tôi luôn cập nhật những xu hướng thời trang mới nhất, từ phong cách thanh lịch đến năng động, để đáp ứng nhu cầu đa dạng của khách hàng.</p>
              <b className='text-gray-800'>Mục tiêu của chúng tôi</b>
              <p>Chúng tôi cam kết không ngừng cải thiện và mang đến những sản phẩm thời trang không chỉ đẹp mà còn bền vững, phù hợp với xu hướng thời trang bền vững đang phát triển. Chúng tôi tin rằng mỗi món đồ của OIOIOI sẽ là một người bạn đồng hành lý tưởng giúp bạn thể hiện phong cách cá nhân độc đáo.</p>
          </div>
      </div>
      <div className='text-4x1 py-4'>
          <Title text1={'TẠI SAO'} text2={'NÊN LỰA CHỌN CHÚNG TÔI'}/>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Đảm bảo chất lượng:</b>
          <p className='text-gray-600'>OIOIOI chú trọng đến từng chi tiết của sản phẩm, từ chất liệu đến đường may, nhằm mang lại trải nghiệm mặc tốt nhất cho khách hàng. Chúng tôi lựa chọn kỹ lưỡng từng loại vải và tuân thủ quy trình sản xuất chất lượng cao.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Tiện lợi:</b>
          <p className='text-gray-600'>Chúng tôi mang đến dịch vụ mua sắm trực tuyến dễ dàng và nhanh chóng, giúp bạn chọn lựa và đặt mua sản phẩm yêu thích mọi lúc, mọi nơi. Với OIOIOI, chỉ cần vài cú nhấp chuột, bạn có thể cập nhật phong cách mới nhất mà không cần phải rời khỏi nhà.</p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Dịch vụ khách hàng đặc biệt:</b>
          <p className='text-gray-600'>OIOIOI luôn sẵn sàng hỗ trợ bạn trong suốt quá trình mua sắm và sau khi nhận hàng. Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn lòng giải đáp mọi thắc mắc để bạn có trải nghiệm mua sắm thoải mái và an tâm.</p>
        </div>
      </div>
      <div className="h-[400px] w-full relative mb-10">
        <div className="h-full w-full object-cover relative">
          <video
            src={beachIntroVideo}
            className="object-cover h-full w-full"
            autoPlay
            muted
            loop
          ></video>
        </div>
      </div>
      <NewsletterBox/>
    </div>
  )
}

export default About
