import {TextField, Button} from '@mui/material';
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
          if (res.status === 200) {
            console.log('User created successfully:', res);
          } else {
            throw new Error(res.json);
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
                {errors.fName && 
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
                {errors.lName && 
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
                    <Icon fontSize="small" />
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