const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
    try {
        const token = req.headers.token; 
        console.log("Token đã nhận là:", token); 
        if (!token) {
            return res.status(401).json({ success: false, message: "Chưa xác thực, vui lòng đăng nhập lại" });
        }

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecoded.role !== "admin") {
            return res.status(403).json({ success: false, message: "Không có quyền truy cập" });
        }
        
        next();
    } catch (error) {
        console.error("Admin Auth bị lỗi:", error); 
        res.status(401).json({ success: false, message: "Token không hợp lệ" });
    }
    
};
const authUser=async(req,res,next)=>{
    const{token}=req.headers;
    if(!token){
        return res.json({success:false,message:"Chưa xác thực, vui lòng đăng nhập lại"})
    }
    try {
        const token_decode =jwt.verify(token,process.env.JWT_SECRET)
        req.body.userId = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}
module.exports = {adminAuth,authUser}
