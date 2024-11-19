import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";

const PlaceOrder = () => {
  const {
    getCartAmount,
    priceDiscount,
    voucherIDD,
    cartItems,
    navigate,
    products,
    getUserCart,
    getUserIdFromToken,
    fetchProducts,
    token,
  } = useContext(ShopContext);
  const [method, setMethod] = useState('COD');
  const [formValues, setFormValues] = useState({
    firstname: '',
    name: '',
    email: '',
    address: '',
    phone: '',
    note: '',
    provinceId:'',
    districtId:'',
    wardId:'',
  });
const [province,setProvince]=useState([]);
const [district,setDistrict]=useState([]);
const [ward,setWard]=useState([]);
const [selectedProvince, setSelectedProvince] = useState('');
const [selectedDistrict, setSelectedDistrict] = useState('');
const [selectedWard, setSelectedWard] = useState('');
  useEffect(() => {
    fetchUser();
    fetchProvinces();
  }, []);

  const fetchUser = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;
  
    try {
      const response = await axios.get(`http://localhost:4000/api/user/customer/${userId}`);
      const user = response.data;
      setFormValues({
        firstname: user.name.split(' ').slice(1).join(' '),
        name: user.name.split(' ')[0],
        email: user.email,
        address: user.address.addressInput || '',
        phone: user.phone || '',
        note: '',
        provinceId: user.address.provinceId || '',
        districtId: user.address.districtId || '',
        wardId: user.address.wardId || '',
      });

      if (user.address.provinceId) {
        setSelectedProvince(user.address.provinceId);
        fetchDistricts(user.address.provinceId);
      }
      if (user.address.districtId) {
        setSelectedDistrict(user.address.districtId);
        fetchWards(user.address.districtId);
      }
      if (user.address.wardId) {
        setSelectedWard(user.address.wardId);
      }
  
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };
  const fetchProvinces = async () => {
    try {
      const response = await axios.get('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1');
      if (Array.isArray(response.data.data.data)) { 
        setProvince(response.data.data.data);
      } else {
        console.error("Expected an array for provinces data");
        setProvince([]); 
      }
    } catch (error) {
      console.error("Error fetching provinces:", error);
      setProvince([]); 
    }
  };
  const fetchDistricts = async (provinceId) => {
    try {
      console.log(provinceId +"  adu ")
      const response = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceId}&limit=-1`);
      if (Array.isArray(response.data.data.data)) { 
        setDistrict(response.data.data.data);
      } else {
        console.error("Expected an array for provinces data");
        setDistrict([]); 
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      console.log(districtId +"  adu ")
      const response = await axios.get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtId}&limit=-1`);
      setWard(response.data.data.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const onFinish = async () => {
    const cusID = getUserIdFromToken();
    const voucherID = voucherIDD;
    const wardName = ward.find(ward => ward.code === selectedWard)?.name ;
    const districtName = district.find(district => district.code === selectedDistrict)?.name;
    const provinceName = province.find(province => province.code === selectedProvince)?.name ;
    const guestInfo = {
        firstname: formValues.firstname,
        name: formValues.name,
        email: formValues.email,
        paymentMethod: method,
        totalMoney: getCartAmount(),
        discount: priceDiscount,
        address: formValues.address + ", "+wardName+", "+districtName+", "+provinceName,
        note: formValues.note,
        phone: formValues.phone
    };
   

    if (!guestInfo.name || !guestInfo.email || !guestInfo.address || !guestInfo.phone||!wardName||!districtName||!provinceName) {
        toast.error("Vui lòng nhập đầy đủ thông tin giao hàng");
        return;
    }

    const orderDetails = Object.keys(cartItems).flatMap(itemId =>
        Object.keys(cartItems[itemId]).map(sizeId => {
            const quantity = cartItems[itemId][sizeId];
            if (quantity > 0) {
                const productData = products.find(product => product._id === itemId);
                if (!productData) return null;
                const productPrice = productData.new_price;
                return {
                    productID: itemId,
                    sizeID: sizeId,
                    quantity,
                    totalMoney: quantity * productPrice,
                    money: productPrice
                };
            }
            return null;
        })
    ).filter(Boolean);

    try {
        if (method === 'COD') {
            const response = await axios.post("http://localhost:4000/orderList/buy", {
                cusID,
                voucherID,
                guestInfo,
                orderDetails,
            },{headers:{token}});
            if(response.data.success){
           await axios.post(`http://localhost:4000/api/cart/clear/${cusID}`);
            getUserCart(localStorage.getItem('token'));
            toast.success("Đặt hàng thành công ! Thông tin đơn hàng đã được gửi tới Email của bạn");
             fetchProducts();
            navigate('/orders');
            }
            else{
              toast.error(response.data.message)
            }
        } else if (method === 'Stripe') {
            const responseStripe=await axios.post('http://localhost:4000/orderList/buystripe',{ cusID,
              voucherID,
              guestInfo,
              orderDetails,},{headers:{token}});
              if (responseStripe.data.success) {
                const { session_url } = responseStripe.data;
                window.location.replace(session_url); 
                fetchProducts();
            }
            else{
              toast.error(responseStripe.data.message)
            }

        } else if (method === 'VNPay') {
          return;
        }

    } catch (e) {
        const errorMessage = e.response?.data?.message || "An error occurred";
        toast.error(errorMessage);
        console.error("[ERROR RESPONSE DATA]", e.response?.data || e.message);
    }
};
const handleProvinceChange = async (e) => {
  const provinceId = e.target.value;
  setSelectedProvince(provinceId);
  setSelectedDistrict('');
  setSelectedWard('');
  setFormValues({ ...formValues, address: '' });

  await fetchDistricts(provinceId);
};

const handleDistrictChange = async (e) => {
  const districtId = e.target.value;
  setSelectedDistrict(districtId);
  setSelectedWard('');
  setFormValues({ ...formValues, address: '' });
  await fetchWards(districtId);
};

const handleWardChange = (e) => {
  const wardId = e.target.value;
  setSelectedWard(wardId);
};

  return (
    <div className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'THÔNG TIN'} text2={'VẬN CHUYỂN'} />
        </div>
        <div className='flex gap-3'>
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            name='firstname' 
            placeholder='Họ' 
            value={formValues.firstname} 
            onChange={handleInputChange}
          />
          <input 
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
            type="text" 
            name='name' 
            placeholder='Tên' 
            value={formValues.name} 
            onChange={handleInputChange}
          />
        </div>
        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="email" 
          name='email' 
          placeholder='Email của bạn' 
          value={formValues.email} 
          onChange={handleInputChange}
        />
       <div className="flex gap-4">
  <select
    className="border border-gray-300 rounded py-1.5 px-3.5 w-full flex-1"
    onChange={handleProvinceChange}
    value={formValues.provinceId}
  >
    <option value="">Chọn tỉnh/thành phố</option>
    {province.map((province) => (
      <option key={province.code} value={province.code}>
        {province.name}
      </option>
    ))}
  </select>

  <select
    className="border border-gray-300 rounded py-1.5 px-3.5 w-full flex-1"
    onChange={handleDistrictChange}
    disabled={!selectedProvince}
    value={formValues.districtId}
  >
    <option value="">Chọn quận/huyện</option>
    {district.map((district) => (
      <option key={district.code} value={district.code}>
        {district.name}
      </option>
    ))}
  </select>

  <select
    className="border border-gray-300 rounded py-1.5 px-3.5 w-full flex-1"
    onChange={handleWardChange}
    disabled={!selectedDistrict}
    value={formValues.wardId}
  >
    <option value="">Chọn phường/xã</option>
    {ward.map((ward) => (
      <option key={ward.code} value={ward.code}>
        {ward.name}
      </option>
    ))}
  </select>
</div>

        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="text" 
          name='address' 
          placeholder='Địa chỉ' 
          value={formValues.address} 
          onChange={handleInputChange}
        />
        <input 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full' 
          type="number" 
          name='phone' 
          placeholder='Số điện thoại' 
          value={formValues.phone} 
          onChange={handleInputChange}
        />
        <textarea 
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full h-20' 
          name="note" 
          placeholder='Ghi chú' 
          value={formValues.note} 
          onChange={handleInputChange}
        />
      </div>
      
      {/* Right Side */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal isOrder={true} />
        </div>

        <div className='mt-12'>
          <Title text1={'PHƯƠNG THỨC'} text2={'THANH TOÁN'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('paypal')} className='flex item-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'paypal' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src="https://canhme.com/wp-content/uploads/2016/01/Paypal.png" alt="Paypal" />
            </div>  
            <div onClick={() => setMethod('Stripe')} className='flex item-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'Stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src="https://memberpress.com/wp-content/uploads/2017/09/Integrations2-768x432-1.jpg" alt="Stripe" />
            </div>
            <div onClick={() => setMethod('COD')} className='flex item-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'COD' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>THANH TOÁN TIỀN MẶT</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button onClick={onFinish} className='bg-black text-white px-16 py-3 text-sm'>ĐẶT HÀNG</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
