import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Close, DangerousSharp, VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import FormSubmit from '../forms/FormSubmit';

import './SignupForm.css';

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async ({ firstName, lastName, email, password }) => {
    setApiError('');
    setSuccessMessage('');

    try {
      if (!firstName || !lastName || !email || !password) {
        throw new Error('All fields are required');
      }
      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        throw new Error('Invalid email format');
      }
      // Validate password length
      if (password.length < 8 || password.length > 25) {
        throw new Error('Password must be between 8 and 25 characters');
      }
      // Validate password complexity
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,25}$/;
      if (!passwordPattern.test(password)) {
        throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      }

      // Validate first name and last name for Vietnamese characters
      const namePattern = /^[a-zA-ZÀÁẢÃẠÂẦẤẨẪẬĂẰẮẲẴẶÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴĐàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ\s]+$/;
      if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
        throw new Error('First name and last name can only contain letters and Vietnamese diacritics');
      }

      const username = firstName + lastName;

      setLoading(true);
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      };

      const response = await fetch('http://localhost:3000/auth/signup/', req);
      const res = await response.json();

      setLoading(false);

      if (res.success) {
        setSuccessMessage(res.message || 'User successfully registered');
        // Tự động chuyển hướng sang trang login sau 2 giây
        setTimeout(() => {
          navigate('/account/signin');
        }, 2000);
      } else {
        setApiError(res.message || 'Registration failed');
      }

    } catch (error) {
      setLoading(false);
      setApiError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <div>
      <div className='signupForm'>
        <div className="signupForm__container">
          <form onSubmit={handleSubmit(onSubmit)} className='signupForm__form'>
            <h4 className='signupForm__section'>Thông tin cá nhân</h4>
            <div className="signupForm__inputContainer">
              <TextField
                label="Họ"
                type="text"
                slotProps={{
                  style: { color: "rgba(0,0,0,.56)" },
                  htmlInput: { style: { fontWeight: "400" } }
                }}
                className='signupForm__input'
                {...register("firstName", { required: true })}
              />
              {errors.firstName &&
                <div className="signupForm__error">
                  <Close fontSize="small" />
                  <span>Hãy nhập họ</span>
                  <DangerousSharp fontSize="small" className="signupForm__reportIcon" />
                </div>
              }
            </div>

            <div className="signupForm__inputContainer">
              <TextField
                label="Tên"
                type="text"
                slotProps={{
                  style: { color: "rgba(0,0,0,.56)" },
                  htmlInput: { style: { fontWeight: "400" } }
                }}
                className='signupForm__input'
                {...register("lastName", { required: true })}
              />
              {errors.lastName &&
                <div className="signupForm__error">
                  <Close fontSize="small" />
                  <span>Hãy nhập tên</span>
                  <DangerousSharp fontSize="small" className="signupForm__reportIcon" />
                </div>
              }
            </div>
            <h5>Họ và tên sẽ được dùng làm tên tài khoản của bạn.</h5>

            <h4 className='signupForm__section'>Bảo mật tài khoản</h4>
            <div className="signupForm__inputContainer">
              <TextField
                label="Địa chỉ email"
                type="email"
                slotProps={{
                  style: { color: "rgba(0,0,0,.56)" },
                  htmlInput: { style: { fontWeight: "400" } }
                }}
                className='signupForm__input'
                {...register("email", { required: true })}
              />
              {errors.email &&
                <div className="signupForm__error">
                  <Close fontSize="small" />
                  <span>Hãy nhập email</span>
                  <DangerousSharp fontSize="small" className="signupForm__reportIcon" />
                </div>
              }
            </div>

            <div className='signupForm__inputContainer'>
              <TextField
                label="Mật khẩu"
                type={passwordShown ? "text" : "password"}
                slotProps={{
                  style: { color: "rgba(0,0,0,.30)" },
                  htmlInput: { style: { fontWeight: "400" } }
                }}
                className='signupForm__passwordInput'
                {...register("password", { required: true })}
              />
              {passwordShown ? (
                <VisibilityOutlined
                  onClick={() => setPasswordShown(!passwordShown)}
                  className='signupForm__visibilityIcon'
                />
              ) : (
                <VisibilityOffOutlined
                  onClick={() => setPasswordShown(!passwordShown)}
                  className='signupForm__visibilityIcon'
                />
              )}

              {errors.password &&
                <div className="signupForm__error">
                  <Close fontSize="small" />
                  <span>Hãy nhập mật khẩu</span>
                  <DangerousSharp fontSize="small" className="signupForm__reportIcon" />
                </div>
              }
              <h5>Tạo mật khẩu dài 8 đến 25 ký tự, bao gồm ít nhất 1 chữ cái in hoa, 1 chữ cái in thường, 1 chữ số và 1 ký tự đặc biệt như .,?!</h5>
            </div>

            {apiError && (
              <div className="signupForm__apiError" style={{ color: 'red', marginBottom: '10px' }}>
                {apiError}
              </div>
            )}
            {successMessage && (
              <div className="signupForm__successMessage" style={{ color: 'green', marginBottom: '10px' }}>
                {successMessage}
              </div>
            )}

            <FormSubmit name={loading ? 'Đang xử lý...' : 'Tạo tài khoản'} type='submit' disabled={loading} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
