const {Customer} = require("../../model/product.model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { verifyEmail } = require('../emailRoute');
const mongoose=require('mongoose')
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
const inactiveCus = async (req, res) => {
  const cusID = req.params.id;
  const { reason } = req.body;

  const cus = await Customer.findById(cusID);
  if (!cus) {
    return res.status(404).json({ message: "Không tìm thấy khách hàng" });
  }
  if (!reason) {
    return res.status(400).json({ message: "Vui lòng nhập lí do" });
  }

  try {
    cus.isActive = false;
    cus.reason = reason;
    await cus.save();

    return res.status(200).json({
      success:true,
      message: "Vô hiệu hóa khách hàng thành công",
      data: cus,
    });
  } catch (e) {
    console.error("Error in inactivating customer: ", e);
    return res.status(500).json({
      success:false,
      message: "Vô hiệu hóa khách hàng thất bại",
      error: e.message,
   });
  }
};

const activeCus = async (req, res) => {
  const cusID = req.params.id;

  const cus = await Customer.findById(cusID);
  if (!cus) {
    return res.status(404).json({ message: "Không tìm thấy khách hàng" });
  }

  try {
    cus.isActive = true;
    cus.reason = "";
    await cus.save();
    return res.status(200).json({
      success:true,
      message: "Kích hoạt tài khoản khách hàng thành công",
    });
  } catch (e) {
    console.error("Error in activating customer: ", e);
    return res.status(500).json({
      success:false,
      message: "Error in activating customer",
      error: e.message,
    });
  }
};

const loginUser =async(req,res)=>{
try{
const{email,password}=req.body;
const user = await Customer.findOne({email});
if(!user)
{
    return res.json({success:false,message:"Email chưa được đăng ký"})
}
if(user.isActive===false)
{
  return res.json({success:false,message:"Tài khoản đã bị khóa với lí do: " +user.reason +". Vui lòng liên hệ damedanehehe@gmail.com để mở khóa"})
}
const isMatch = await bcrypt.compare(password,user.password);
if(isMatch)
{
    const token=createToken(user._id)
    res.json({success:true,token})
}
else {
    res.json({success:false,message:"Thông tin không hợp lệ"})
}
}
catch(error){
console.log(error);
res.json({success:false,message:error.message})
}
}


const registerUser = async (req, res) => {
  try {
      const { name, email, password } = req.body;
      const exists = await Customer.findOne({ email });
      if (exists) {
          return res.json({ success: false, message: "Email đã tồn tại" });
      }

      const trimmedEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const minEmailLength = 5;
      const maxEmailLength = 50;

      if (
          !trimmedEmail.match(emailRegex) ||
          trimmedEmail.length < minEmailLength ||
          trimmedEmail.length > maxEmailLength ||
          trimmedEmail.includes('..')
      ) {
          return res.status(400).json({ success: false, message: "Vui lòng nhập đúng định dạng email" });
      }

      if (password.length < 6 || password.length > 20) {
          return res.json({ success: false, message: "Vui lòng nhập mật khẩu từ 6-20 kí tự" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newCustomer = new Customer({
          name,
          email: trimmedEmail,
          password: hashedPassword,
          isActive: false,
          reason: "Vui lòng xác nhận email"
      });
      const user = await newCustomer.save();
      const verificationLink = `http://localhost:4000/api/user/active/${user._id}`;
      res.json({ success: true, message: "Email đã được gửi, vui lòng kiểm tra email của bạn"});
      await verifyEmail(trimmedEmail, verificationLink);
  } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
  }
};

const loginAdmin = async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ success: true, token });
      } else {
        res.json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  const updateCusInfo = async (req, res) => {
    const { id } = req.params; 
    const { name, phone, address} = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    if (phone.length !== 10 || phone[0] !== '0') {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đúng định dạng số điện thoại" });
    }
    try {
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
        }
        if (name) customer.name = name;
        if (phone) customer.phone = phone;
        if (address) customer.address = address;
        await customer.save();
        return res.status(200).json({ message: 'Cập nhật thông tin khách hàng thành công', customer });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while updating customer information' });
    }
};
const changePassword = async (req, res) => {
  const { id } = req.params; 
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (newPassword.length < 6 || newPassword.length > 20) {
    return res.status(400).json({ success: false, message: "Vui lòng nhập mật khẩu từ 6-20 kí tự" });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ success: false, message: "Mật khẩu xác nhận không khớp" });
  }

  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ success: false, message: "Không tìm thấy khách hàng" });
    }

    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mật khẩu hiện tại không đúng" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  
    customer.password = hashedNewPassword;
    await customer.save();

    return res.status(200).json({ success: true, message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Error in changing password: ", error);
    return res.status(500).json({ success: false, message: "Đổi mật khẩu thất bại", error: error.message });
  }
};
// const changePassword = async (req, res) => {
//   const { id } = req.params;  
//   const { currentPassword, newPassword, confirmNewPassword, otp } = req.body;

//   if (newPassword.length < 6 || newPassword.length > 20) {
//       return res.status(400).json({ success: false, message: "Password must be 6-20 characters" });
//   }

//   if (newPassword !== confirmNewPassword) {
//       return res.status(400).json({ success: false, message: "Password confirmation does not match" });
//   }

//   try {
//       const customer = await Customer.findById(id);
//       if (!customer) {
//           return res.status(404).json({ success: false, message: "Customer not found" });
//       }

//       const storedOtp = otpStore[customer.email];
//       if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
//           return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
//       }

//       const isMatch = await bcrypt.compare(currentPassword, customer.password);
//       if (!isMatch) {
//           return res.status(400).json({ success: false, message: "Incorrect current password" });
//       }

//       const salt = await bcrypt.genSalt(10);
//       const hashedNewPassword = await bcrypt.hash(newPassword, salt);

//       customer.password = hashedNewPassword;
//       await customer.save();
//       delete otpStore[customer.email]; 

//       return res.status(200).json({ success: true, message: "Password changed successfully" });
//   } catch (error) {
//       console.error('Error changing password:', error);
//       return res.status(500).json({ success: false, message: "Error changing password", error: error.message });
//   }
// };
module.exports = {
    loginUser,
    registerUser,
    loginAdmin,
    activeCus,
    inactiveCus,
    updateCusInfo,
    changePassword,
};