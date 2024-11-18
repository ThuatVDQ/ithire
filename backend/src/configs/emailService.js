// services/emailService.js
const nodemailer = require("nodemailer");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Địa chỉ email của bạn
    pass: process.env.EMAIL_PASSWORD, // Mật khẩu email của bạn
  },
});

// Tạo mã OTP ngẫu nhiên
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // OTP 6 chữ số
};

// Gửi OTP qua email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP sent to email:", email);
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Error sending OTP");
  }
};

// Gửi OTP và lưu vào cơ sở dữ liệu
const sendOTPForAction = async (email, actionType) => {
  const otp = generateOTP();  // Tạo mã OTP
  const otpExpireTime = 5 * 60 * 1000;  // Thời gian hết hạn (5 phút)

  // Lưu OTP vào cơ sở dữ liệu
  const otpExpireDate = new Date(Date.now() + otpExpireTime);  // Tính thời gian hết hạn

  // Cập nhật OTP và thời gian hết hạn vào CSDL
  await User.findOneAndUpdate(
    { email },
    { otp, otpExpire: otpExpireDate },
    { new: true }
  );

  // Gửi OTP qua email
  await sendOTPEmail(email, otp);

  return { otp, message: `OTP sent for ${actionType}` };
};

// Xác thực OTP từ CSDL
const verifyOTP = async (email, otp) => {
    // Tìm người dùng từ email
    const user = await User.findOne({ email });
  
    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
      throw new Error("User not found.");
    }
  
    // Kiểm tra nếu không có OTP
    if (!user.otp) {
      throw new Error("OTP does not exist.");
    }
  
    // Kiểm tra nếu OTP đã hết hạn
    if (user.otpExpire < Date.now()) {
      throw new Error("OTP has expired.");
    }
  
    // Kiểm tra OTP có khớp không
    if (user.otp !== otp) {
      throw new Error("Invalid OTP");
    }
  
    // Nếu OTP hợp lệ, xóa OTP và thời gian hết hạn sau khi xác thực thành công
    user.otp = null;
    user.otpExpire = null;
    await user.save();
  
    return "OTP verified successfully";
  };  

  const sendApplicationAcceptedEmail = async (candidateEmail, jobTitle, companyName) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: candidateEmail,
      subject: `Your Application for ${jobTitle} at ${companyName} Has Been Accepted!`,
      text: `Dear Candidate,
  
      Congratulations! Your application for the job position of ${jobTitle} at ${companyName} has been accepted. Please follow up with the recruiter for the next steps.
  
      Best regards,
      The Recruitment Team`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Acceptance email sent to:", candidateEmail);
    } catch (error) {
      console.error("Error sending application acceptance email:", error);
      throw new Error("Error sending email");
    }
  };
  
  const sendJobRejectionEmail = async (recruiterEmail, jobTitle, companyName) => {
    const mailOptions = {
      from: process.env.EMAIL,
      to: recruiterEmail,
      subject: `Job Rejection for ${jobTitle} at ${companyName}`,
      text: `Dear Recruiter,
  
      We regret to inform you that the job application for the position of ${jobTitle} at ${companyName} has been rejected. Please review the details and make any necessary adjustments.
  
      Best regards,
      The Admin Team`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log("Rejection email sent to:", recruiterEmail);
    } catch (error) {
      console.error("Error sending job rejection email:", error);
      throw new Error("Error sending email");
    }
  };

module.exports = { sendOTPForAction, verifyOTP, sendApplicationAcceptedEmail, sendJobRejectionEmail };
