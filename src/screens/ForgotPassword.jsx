import React, { useState } from 'react';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setInfoMessage('');
  
    // Giả lập gửi OTP (2 giây)
    setTimeout(() => {
      setLoading(false);
      setInfoMessage("Vui lòng kiểm tra email để lấy OTP");
  
      // Hiển thị thông báo 2 giây rồi mới chuyển form
      setTimeout(() => {
        setInfoMessage('');
        setStep(2);
      }, 1500);
    }, 2000);

    const response = await fetch('http://localhost:3000/auth/forgotPassword/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    const res = await response.json();

    if (res.success) {
      console.log('OTP sent successfully:', res);
      setInfoMessage("Vui lòng kiểm tra email để lấy OTP");
    } else {
      console.error('Error sending OTP:', res.message);
      setInfoMessage("Có lỗi xảy ra khi gửi OTP. Vui lòng thử lại.");
    }
  };
  

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    const response = await fetch('http://localhost:3000/auth/resetPassword/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword, confirmNewPassword: confirmPassword }),
    });
    const res = await response.json();
    if (res.success) {
      console.log('Password reset successfully:', res);
      alert("Mật khẩu đã được đặt lại thành công!");
      // Có thể chuyển hướng người dùng đến trang đăng nhập
      window.location.href = '/account/signin';
    } else {
      console.error('Error resetting password:', res.message);
      alert("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.");
    }    
  };

  return (
    <div className="forgot-container">
      {step === 1 && (
        <form className={`forgot-card fade-in`} onSubmit={handleSendOTP}>
            <h2>Gửi OTP</h2>
            <input
            className="forgot-input"
            type="email"
            placeholder="Email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
            <button className="forgot-button" type="submit" disabled={loading}>
            {loading ? (
                <>
                <span className="loader"></span> Đang gửi email...
                </>
            ) : (
                "Gửi yêu cầu"
            )}
            </button>

            {infoMessage && <p className="info-text">{infoMessage}</p>}
        </form>
        )}

      {step === 2 && (
        <form className="forgot-card fade-in" onSubmit={handleResetPassword}>
          <h2>Đặt lại mật khẩu</h2>

          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            className="input-reset"
            readOnly
          />

          <label>Mật khẩu mới</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="input-reset"
          />

          <label>Xác nhận mật khẩu mới</label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="input-reset"
          />

          <label>OTP</label>
          <input
            type="text"
            required
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="input-reset"
          />

          <button type="submit" className="reset-button">Đặt lại mật khẩu</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
