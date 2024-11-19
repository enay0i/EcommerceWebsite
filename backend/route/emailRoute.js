
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const fs = require('fs');
const path =require('path')
const crypto = require('crypto');
const formatToVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const otpStore = {};
const sendOtpForPasswordReset = async (email) => {
    const otp = generateOtp();

    otpStore[email] = {
        otp,
        expiresAt: Date.now() + 10 * 60 * 1000 
    };

    try {
        let info = await transporter.sendMail({
            from: '"OIOIOI Store" <damedanehehe@gmail.com>',
            to: email,
            subject: 'Reset Mật Khẩu OTP - OIOIOI Store',
            text: `OTP để reset mật khẩu của bạn là: ${otp}`,
            html: `<p>OTP để reset mật khẩu của bạn là: <strong>${otp}</strong></p><p>OTP này có hiệu lực trong vòng 10 phút.</p>`
        });
        console.log('OTP đã gửi tới email:', info.response);
    } catch (error) {
        console.error('Error sending OTP email:', error);
    }
};
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    await sendOtpForPasswordReset(email);
    res.send('OTP has been sent to your email');
});


router.post('/verify-otp', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).send('Email, OTP, and new password are required');
    }

    const storedOtpData = otpStore[email];
    if (!storedOtpData || storedOtpData.otp !== otp || Date.now() > storedOtpData.expiresAt) {
        return res.status(400).send('Invalid or expired OTP');
    }

    console.log(`Password for ${email} has been reset to ${newPassword}`);

    delete otpStore[email];

    res.send('Password has been reset successfully');
});
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'damedanehehe@gmail.com',
        pass: 'qfzsopwlquizttce'
    }
});

router.post('/send-email', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('Không có email được nhập');
    }
    try {
        const mailOptions = {
            from: '"OIOIOI Store" <damedanehehe@gmail.com>',
            to: email,
            subject: 'Cảm Ơn Bạn Đã Ghé Thăm OiOiOi!',
            text: "Đây là mã giảm giá của bạn: GIAMGIA20%"
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email đã gửi: ' + info.response);
        res.send('Gửi email thành công !');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error: Something went wrong. Please try again.');
    }
});
const sendOrderConfirmation = async (orderId, guestInfo, orderDetails) => {
    try {
        let total=0;
        const order =orderDetails.map(detail=>{
            total+=detail.totalMoney
        })
        console.log(" vai ca dai "+total)
        const orderItemsHtml = orderDetails.map(detail => `
             <tr>
                      <td class="pc-w620-halign-left pc-w620-valign-middle pc-w620-padding-20-0-20-0 pc-w620-width-100pc" align="left" valign="middle" style="padding: 20px 0px 20px 0px; border-bottom: 1px solid #e7e7d2b3;">
                       <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                         <td valign="top" style="padding: 0px 0px 0px 0px;">
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                           <tr>
                            <td class="pc-w620-align-left" valign="top" style="padding: 0px 0px 0px 0px;">
                             <table class="pc-w620-view-vertical pc-w620-align-left" border="0" cellpadding="0" cellspacing="0" role="presentation">
                              <tr>
                               <th valign="top" style="font-weight: normal; text-align: left;">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td class="pc-w620-spacing-0-0-0-0 pc-w620-align-left" valign="top" style="padding: 0px 20px 0px 0px;">
                                   <img src=${detail.productID.additionalImages[0]} class="pc-w620-align-left" width="102" height="132" alt="" style="display: block; outline: 0; line-height: 100%; -ms-interpolation-mode: bicubic; width: 102px; height: auto; max-width: 100%; border-radius: 8px 8px 8px 8px; border: 0;" />
                                  </td>
                                 </tr>
                                </table>
                               </th>
                               <th valign="top" style="font-weight: normal; text-align: left;">
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                 <tr>
                                  <td class="pc-w620-spacing-0-0-0-0" valign="top" style="padding: 0px 0px 0px 0px;">
                                   <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                    <tr>
                                     <td class="pc-w620-padding-8-0-0-0 pc-w620-align-left" valign="top" style="padding: 28px 0px 0px 0px;">
                                      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                                       <tr>
                                        <th class="pc-w620-align-left" align="left" valign="top" style="font-weight: normal; text-align: left; padding: 0px 0px 2px 0px;">
                                         <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-align-left" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                                          <tr>
                                           <td valign="top" class="pc-w620-align-left" align="left" style="padding: 0px 0px 0px 0px;">
                                            <div class="pc-font-alt pc-w620-align-left pc-w620-fontSize-16 pc-w620-lineHeight-26" style="line-height: 24px; letter-spacing: -0px; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 16px; font-weight: 600; font-variant-ligatures: normal; color: #121212cc; text-align: left; text-align-last: left;">
                                             <div><span>${detail.productID.name}</span>
                                             </div>
                                            </div>
                                           </td>
                                          </tr>
                                         </table>
                                        </th>
                                       </tr>
                                       <tr>
                                        <th class="pc-w620-align-left" align="left" valign="top" style="font-weight: normal; text-align: left;">
                                         <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-align-left" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                                          <tr>
                                           <td valign="top" class="pc-w620-align-left" align="left">
                                            <div class="pc-font-alt pc-w620-align-left" style="line-height: 24px; letter-spacing: -0px; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; font-variant-ligatures: normal; color: #1d3425cc; text-align: left; text-align-last: left;">
                                             <div><span>Size: ${detail.sizeID.sizeName}</span>
                                             </div>
                                            </div>
                                           </td>
                                          </tr>
                                         </table>
                                        </th>
                                       </tr>
                                       <tr>
                                        <th class="pc-w620-align-left" align="left" valign="top" style="font-weight: normal; text-align: left;">
                                         <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-align-left" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                                          <tr>
                                           <td valign="top" class="pc-w620-align-left" align="left">
                                            <div class="pc-font-alt pc-w620-align-left" style="line-height: 24px; letter-spacing: -0px; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 600; font-variant-ligatures: normal; color: #1d3425cc; text-align: left; text-align-last: left;">
                                             <div><span>Số lượng: ${detail.quantity}</span>
                                             </div>
                                            </div>
                                           </td>
                                          </tr>
                                         </table>
                                        </th>
                                       </tr>
                                      </table>
                                     </td>
                                    </tr>
                                   </table>
                                  </td>
                                 </tr>
                                </table>
                               </th>
                              </tr>
                             </table>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </table>
                      </td>
                      <td class="pc-w620-halign-right pc-w620-valign-middle pc-w620-padding-5-0-0-40" align="right" valign="middle" style="padding: 0px 0px 0px 0px; border-bottom: 1px solid #e7e7d2b3;">
                       <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                        <tr>
                         <td class="pc-w620-spacing-0-0-0-0 pc-w620-align-right" align="right" valign="top">
                          <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="pc-w620-align-right" width="100%" style="border-collapse: separate; border-spacing: 0; margin-right: auto; margin-left: auto;">
                           <tr>
                            <td valign="top" class="pc-w620-padding-0-0-0-0 pc-w620-align-right" align="right">
                             <div class="pc-font-alt pc-w620-align-right pc-w620-fontSize-16 pc-w620-lineHeight-20" style="line-height: 22px; letter-spacing: -0px; font-family: 'Inter', Arial, Helvetica, sans-serif; font-size: 14px; font-weight: 800; font-variant-ligatures: normal; color: #1d3425; text-align: right; text-align-last: right;">
                              <div><span>${formatToVND(detail.totalMoney)}</span>
                              </div>
                             </div>
                            </td>
                           </tr>
                          </table>
                         </td>
                        </tr>
                       </table>
                      </td>
                     </tr>
        `).join('');
        const a =guestInfo.firstname+" "+guestInfo.name
        const emailHtmlPath =  path.join(__dirname, './email.html');
        let emailHtml = fs.readFileSync(emailHtmlPath, 'utf8')
         emailHtml=emailHtml.replace('{{products}}',orderItemsHtml).replace('tamtinh',formatToVND(total)).replace('guestInfo.discount',formatToVND(guestInfo.discount)).replace('guestInfo.totalMoney',formatToVND(guestInfo.totalMoney)).replace('guestInfo.name',a).replace('guestInfo.email',guestInfo.email).replace('guestInfo.address',guestInfo.address).replace('guestInfo.phone',guestInfo.phone).replace('guestInfo.paymentMethod',guestInfo.paymentMethod);
        let info = await transporter.sendMail({
            from: '"OIOIOI Store" <damedanehehe@gmail.com>',
            to: guestInfo.email,
            subject: 'Xác Nhận Đơn Hàng Từ OIOIOI',
            html: emailHtml
        });
        console.log("Email xac nhan don hang da duoc gui thanh cong:", info.response);
    } catch (error) {
        console.error("Gap loi trong qua trinh gui email:", error);
    }
};


const verifyEmail = async (email, link) => {
    try {
        let info = await transporter.sendMail({
            from: '"OIOIOI Store" <damedanehehe@gmail.com>',
            to: email,
            subject: 'Xác Thực Email',
            text: "Welcome",
            
            html: `
            <div>
                <p>Chào bạn,</p>
                <p>Vui lòng nhấn vào đoạn chữ bên dưới để kích hoạt tài khoản Shop OIOIOI của bạn:</p>
                <form action="${link}" method="POST" style="display:inline;">
                    <input type="submit" value="Nhấn vào đây để xác thực email của bạn" style="background:none; border:none; color:blue; text-decoration:underline; cursor:pointer; font-size:inherit; padding:0;">
                </form>
            </div>
        `
        });
        console.log("Email đã được gửi thành công", info);
    } catch (error) {
        console.error("Mail gửi thất bại", error);
    }
};


module.exports = router;
module.exports.verifyEmail = verifyEmail;
module.exports.sendOrderConfirmation=sendOrderConfirmation;
