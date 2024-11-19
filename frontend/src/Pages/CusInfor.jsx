import React, { useState, useContext, useEffect } from 'react';
import Title from '../components/Title';
import { Col, Row, Form, Input, Button } from 'antd';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const CusInfor = () => {
  const [selectedSection, setSelectedSection] = useState('info');
  const {
    getUserIdFromToken,
  } = useContext(ShopContext);

  const [method, setMethod] = useState('COD');
  const [formValues, setFormValues] = useState({
    firstname: '',
    name: '',
    email: '',
    addressInput: '',
    phone: '',
    note: '',
    provinceId: '',
    districtId: '',
    wardId: '',
  });

  const [province, setProvince] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [passwordValues, setPasswordValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

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
        addressInput: user.address.addressInput || '',
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
        console.error('Expected an array for provinces data');
        setProvince([]);
      }
    } catch (error) {
      console.error('Error fetching provinces:', error);
      setProvince([]);
    }
  };

  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceId}&limit=-1`);
      if (Array.isArray(response.data.data.data)) {
        setDistrict(response.data.data.data);
      } else {
        console.error('Expected an array for districts data');
        setDistrict([]);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtId}&limit=-1`);
      setWard(response.data.data.data);
    } catch (error) {
      console.error('Error fetching wards:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFormSubmit = (values) => {
    console.log('Form values:', values);
  };

  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedWard('');
    setFormValues({ ...formValues, provinceId: provinceId});

    await fetchDistricts(provinceId);
  };

  const handleFormUpdate = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    try {
      const response = await axios.post(`http://localhost:4000/api/user/updateCus/${userId}`, {
        ...formValues,
        address: {
          provinceId: formValues.provinceId,
          districtId: formValues.districtId,
          wardId: formValues.wardId,
          addressInput: formValues.addressInput,
        }
      });
      toast.success("Cập nhật thông tin khách hàng thành công");
      fetchUser();
    } catch (error) {
      toast.error('Error updating customer information');
    }
  };
  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setFormValues({ ...formValues, districtId: districtId });
    await fetchWards(districtId);
  };
  const handlePasswordChange = async () => {
    const userId = getUserIdFromToken();
    if (!userId) return;
  
    if (passwordValues.newPassword !== passwordValues.confirmNewPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không trùng khớp');
      return;
    }
  
    try {
      await axios.post(`http://localhost:4000/api/user/changePassword/${userId}`, {
        currentPassword: passwordValues.currentPassword,
        newPassword: passwordValues.newPassword,
        confirmNewPassword: passwordValues.confirmNewPassword // Added this line
      });
      toast.success('Đổi mật khẩu thành công');
      setPasswordValues({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Đổi mật khẩu thất bại';
      toast.error(errorMessage);
    }
  };
  
  const handleWardChange = (e) => {
    const wardId = e.target.value;
    setSelectedWard(wardId);
    setFormValues({ ...formValues, wardId: wardId });
  };
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues({ ...passwordValues, [name]: value });
  };
  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'THÔNG TIN'} text2={'CÁ NHÂN'} />

        <Row gutter={12} className="mt-8">
          <Col xs={12} sm={4} className="space-y-4 border-r border-gray-300">
            <div
              onClick={() => setSelectedSection('info')}
              className={`font-semibold text-gray-700 cursor-pointer ${selectedSection === 'info' ? 'text-blue-500' : ''}`}
            >
              Thông tin cá nhân
            </div>
            <div
              onClick={() => setSelectedSection('password')}
              className={`font-semibold text-gray-700 cursor-pointer ${selectedSection === 'password' ? 'text-blue-500' : ''}`}
            >
              Đổi mật khẩu
            </div>
          </Col>

          <Col xs={12} sm={16} className="space-y-4">
            {selectedSection === 'info' && (
              <div className="flex flex-col gap-4 w-full ml-20">
                <div className="flex gap-3">
                  <input
                    className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    type="text"
                    name="name"
                    placeholder="Tên"
                    value={formValues.name}
                    onChange={handleInputChange}
                  />
                </div>
                <input
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="email"
                  name="email"
                  placeholder="Email của bạn"
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
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="text"
                  name="addressInput"
                  placeholder="Địa chỉ cụ thể"
                  value={formValues.addressInput}
                  onChange={handleInputChange}
                />
                <input
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  type="number"
                  name="phone"
                  placeholder="Số điện thoại"
                  value={formValues.phone}
                  onChange={handleInputChange}
                />

                <button
                  className="self-end mt-2 px-2 rounded-lg bg-black text-white hover:bg-gray-500"
                  onClick={handleFormUpdate}
                >
                  Cập nhật
                </button>
              </div>
            )}
             {selectedSection === 'password' && (
              <div className="flex flex-col gap-4 w-full ml-20">
                <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="password" name="currentPassword" placeholder="Mật khẩu hiện tại" value={passwordValues.currentPassword} onChange={handlePasswordInputChange} />
                <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="password" name="newPassword" placeholder="Mật khẩu mới" value={passwordValues.newPassword} onChange={handlePasswordInputChange} />
                <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="password" name="confirmNewPassword" placeholder="Xác nhận mật khẩu mới" value={passwordValues.confirmNewPassword} onChange={handlePasswordInputChange} />
                <button className="self-end mt-2 px-2 rounded-lg bg-black text-white hover:bg-gray-500" onClick={handlePasswordChange}>Đổi mật khẩu</button>
              </div>
            )}
          </Col>
          
        </Row>
      </div>
    </div>
  );
};

export default CusInfor;
