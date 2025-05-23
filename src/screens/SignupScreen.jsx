import React from 'react';
import { Link } from 'react-router-dom';
import SignupForm from '../forms/SignupForm';
import './SignupScreen.css';

function SignupScreen() {
  return (
    <div className="signupScreen">
      <div className="signupScreen__info">
        <h1>Đăng ký tài khoản của bạn</h1>
      </div>
      <div className="signupScreen__main">  
        <SignupForm />
      </div>
    </div>
  );
}

export default SignupScreen;