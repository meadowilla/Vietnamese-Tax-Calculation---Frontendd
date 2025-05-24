import {TextField} from '@mui/material';
import {useForm} from 'react-hook-form';
import {useState} from 'react';
import {Close, DangerousSharp, VisibilityOffOutlined, VisibilityOutlined} from '@mui/icons-material';
import FormSubmit from '../forms/FormSubmit';

import './SignupForm.css'

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [passwordShown, setPasswordShown] = useState(false);

  const onSubmit = async ({firstName, lastName, email, password}) => {
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
      // Validate first name and last name
      const namePattern = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐÊÔƠƯĐàáâãèéêìíòóôõùúăđêôơưđ]+$/;
      if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
        throw new Error('First name and last name can only contain letters');
      }

      const username = firstName + lastName;
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      };

      await fetch('http://localhost:3000/auth/signup/', req)
        .then(response => response.json())
        .then(res => {
          if (res.success) {
            console.log('User created successfully:', res);
          } else {
            console.log('Error creating user:', res);
            // throw new Error("User already exists");
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        }
      );

    } catch (error) {
      console.error('Error:', error);
    }
  }

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
                  // error={!!errors.fName}
                  {...register("firstName", { required: true })}
                />
                {errors.firstName && 
                  <div className="signupForm__error">
                    <Close fontSize="small" />
                    <span>Hãy nhập họ</span>
                    <DangerousSharp
                      fontSize="small"
                      className="signupForm__reportIcon"
                    />
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
                  // error={!!errors.lName}
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && 
                  <div className="signupForm__error">
                    <Close fontSize="small" />
                    <span>Hãy nhập tên</span>
                    <DangerousSharp
                      fontSize="small"
                      className="signupForm__reportIcon"
                    />
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
                  // error={!!errors.email}
                  {...register("email", { required: true })}
                />
                {errors.email && 
                  <div className="signupForm__error">
                    <Close fontSize="small" />
                    <span>Hãy nhập email</span>
                    <DangerousSharp
                      fontSize="small"
                      className="signupForm__reportIcon"
                    />
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
                    onClick={() => setPasswordShown((passwordShown)=> !passwordShown)}
                    className='signupForm__visibilityIcon'
                  />
                ) : (
                  <VisibilityOffOutlined
                    onClick={() => setPasswordShown((passwordShown)=> !passwordShown)}
                    className='signupForm__visibilityIcon'
                  />
                )}
  
                {errors.password && 
                  <div className="signupForm__error">
                    <Close fontSize="small" />
                    <span>Hãy nhập mật khẩu</span>
                    <DangerousSharp
                      fontSize="small"
                      className="signupForm__reportIcon"
                    />
                  </div>
                }
                <h5>Tạo mật khẩu dài 8 đến 25 ký tự, bao gồm ít nhất 1 chữ cái in hoa, 1 chữ cái in thường, 1 chữ số và 1 ký tự đặc biệt như .,?!</h5>
              </div>
              <FormSubmit name='Tạo tài khoản' type='submit'></FormSubmit>
            </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;