import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { Close, DangerousSharp, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import './LoginScreen.css';
import FormSubmit from '../forms/FormSubmit';
import { login } from '../redux/UserSlice';

function LoginScreen() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [passwordShown, setPasswordShown] = useState(false);
  const dispatch = useDispatch();

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async ({ email, password }) => {
    try {
      setMessage(null);
      setIsError(false);
      setLoading(true);

      // Không validate phức tạp password ở FE nữa, chỉ rely vào backend

      const response = await fetch('http://localhost:3000/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const res = await response.json();

      if (res.success) {
        setMessage('Đăng nhập thành công!');
        setIsError(false);

        dispatch(login({
          accessToken: res.accessToken,
          userId: res.userId,
        }));
      } else {
        setMessage(res.message || 'Email hoặc mật khẩu không đúng');
        setIsError(true);
      }
    } catch (error) {
      setMessage(error.message || 'Lỗi kết nối máy chủ');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="loginScreen">
        <div className="loginScreen__info">
          <h1>Đăng nhập tài khoản của bạn</h1>
        </div>
        <div className="loginScreen__main">
          <div className="loginScreen__form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="loginScreen__inputContainer">
                <TextField
                  label="Địa chỉ email"
                  name="email"
                  type="email"
                  slotProps={{
                    style: { color: 'rgba(0,0,0,.30)' },
                    htmlInput: { style: { fontWeight: '800' } }
                  }}
                  className="loginScreen__emailInput"
                  {...register('email', { required: true })}
                />
                {errors.email && (
                  <div className="loginScreen__error">
                    <Close fontSize="small" />
                    <span>Hãy nhập email</span>
                    <DangerousSharp fontSize="small" className="loginScreen__reportIcon" />
                  </div>
                )}
              </div>

              <div className="loginScreen__inputContainer">
                <TextField
                  label="Mật khẩu"
                  name="password"
                  type={passwordShown ? 'text' : 'password'}
                  slotProps={{
                    style: { color: 'rgba(0,0,0,.30)' },
                    htmlInput: { style: { fontWeight: '800' } }
                  }}
                  className="loginScreen__passwordInput"
                  {...register('password', { required: true })}
                />
                {passwordShown ? (
                  <VisibilityOutlined
                    onClick={() => setPasswordShown(ps => !ps)}
                    className="loginScreen__visibilityIcon"
                  />
                ) : (
                  <VisibilityOffOutlined
                    onClick={() => setPasswordShown(ps => !ps)}
                    className="loginScreen__visibilityIcon"
                  />
                )}

                {errors.password && (
                  <div className="loginScreen__error">
                    <Close fontSize="small" />
                    <span>Hãy nhập mật khẩu</span>
                    <DangerousSharp fontSize="small" className="loginScreen__reportIcon" />
                  </div>
                )}
              </div>

              {message && (
                <div
                  className={isError ? 'loginScreen__errorMessage' : 'loginScreen__successMessage'}
                  role="alert"
                >
                  {message}
                </div>
              )}

              <div className="loginScreen__resetLink">
                <Link to="/account/forgot-password">Quên mật khẩu?</Link>
              </div>

              <FormSubmit
                name={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                type="submit"
                variant="contained"
                disabled={loading}
              />
            </form>
          </div>
          <div className="loginScreen__rewards">
            <h4>ĐĂNG KÝ VIETNAMESE TAX CALCULATOR</h4>
            <p>Là người dùng đăng ký tài khoản, bạn có thể sử dụng các tính năng cá nhân hóa như xem lịch sử thuế, dự đoán/tính thuế theo năm, lưu/xuất báo cáo thuế.</p>
          </div>
          <div className="loginScreen__joinNow">
            <Link to="/account/create">Đăng ký tài khoản</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
