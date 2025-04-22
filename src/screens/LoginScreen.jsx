import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import {TextField} from '@mui/material';
import {Close, DangerousSharp, VisibilityOffOutlined, VisibilityOutlined} from '@mui/icons-material';
import './LoginScreen.css';
import FormSubmit from '../forms/FormSubmit';

function LoginScreen() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [passwordShown, setPasswordShown] = useState(false);

  const onSubmit = ({email, password}) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
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
      
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      };

      fetch('http://localhost:3000/auth/login/', req)
        .then(response => response.json())
        .then(res => {
          if (res.status === 200) {
            console.log('User logged in successfully:', res);
          } else {
            throw new Error("Invalid email or password");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  return (
    <div>
      <div className="loginScreen">
        <div className="loginScreen__info">
          <h1>Đăng nhập tài khoản của bạn</h1>
        </div>
        <div className="loginScreen__main">
          <div className="loginScreen__form">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='loginScreen__inputContainer'>
                <TextField 
                  label="Địa chỉ email" 
                  name="email" 
                  type="email" 
                  slotProps={{
                    style: { color: "rgba(0,0,0,.30)" },
                    htmlInput: { style: { fontWeight: "800" } }
                  }}
                  className='loginScreen__emailInput'
                  {...register("email", { required: true })}
                />
                {errors.email && 
                  <div className="loginScreen__error">
                    <Close fontSize="small" />
                    <span>Hãy nhập email</span>
                    <DangerousSharp
                      fontSize="small"
                      className="loginScreen__reportIcon"
                    />
                  </div>
                }
              </div>

              <div className='loginScreen__inputContainer'>
                <TextField 
                  label="Mật khẩu" 
                  name="password" 
                  type={passwordShown ? "text" : "password"}
                  slotProps={{
                    style: { color: "rgba(0,0,0,.30)" },
                    htmlInput: { style: { fontWeight: "800" } }
                  }}
                  className='loginScreen__passwordInput'
                  {...register("password", { required: true })}
                />
                {passwordShown ? (
                  <VisibilityOutlined
                    onClick={() => setPasswordShown((passwordShown)=> !passwordShown)}
                    className='loginScreen__visibilityIcon'
                  />
                ) : (
                  <VisibilityOffOutlined
                    onClick={() => setPasswordShown((passwordShown)=> !passwordShown)}
                    className='loginScreen__visibilityIcon'
                  />
                )}

                {errors.password && 
                  <div className="loginScreen__error">
                    <Close fontSize="small" />
                    <span>Hãy nhập mật khẩu</span>
                    <DangerousSharp
                      fontSize="small"
                      className="loginScreen__reportIcon"
                    />
                  </div>
                }
              </div>

              <div className='loginScreen__resetLink'>
                <Link to="/account/forgot-password">Quên mật khẩu?</Link>
              </div>

              <FormSubmit name="Đăng nhập" type="submit" variant='contained'></FormSubmit>
            </form>
          </div>
          <div className='loginScreen__rewards'>
              <h4>ĐĂNG KÝ VIETNAMESE TAX CALCULATOR</h4>
              <p>Là người dùng đăng ký tài khoản, bạn có thể sử dụng các tính năng cá nhân hóa như xem lịch sử thuế, dự đoán/tính thuế theo năm, lưu/xuất báo cáo thuế.</p>
          </div>
          <div className='loginScreen__joinNow'>
            <Link to="/account/create">Đăng ký tài khoản</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
