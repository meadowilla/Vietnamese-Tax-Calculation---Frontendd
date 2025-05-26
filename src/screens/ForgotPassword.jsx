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

    const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email}),
      };

    fetch('http://localhost:3000/auth/forgotPassword/', req)
      .then(response => response.json())
      .then(res => {
        if (res.status === 200) {
          console.log('Send OTP successfully:', res);
        } else {
          throw new Error("Internal server error");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      }
    );
  };
  

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
    const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
      };

    fetch('http://localhost:3000/auth/resetPassword/', req)
      .then(response => response.json())
      .then(res => {
        if (res.status === 200) {
          console.log('Reset password successfully:', res);
        } else {
          throw new Error("Internal server error");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      }
    );
    console.log("Resetting password for:", email, "OTP:", otp);
    alert("Đặt lại mật khẩu thành công!");
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
