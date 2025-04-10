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
              <h4 className='signupForm__section'>Personal Information</h4>
              <div className="signupForm__inputContainer">
                <TextField 
                  label="First name" 
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
                    <span>Enter your first name.</span>
                    <DangerousSharp
                      fontSize="small"
                      className="signupForm__reportIcon"
                    />
                  </div>
                }
              </div>

              <div className="signupForm__inputContainer">
                <TextField 
                  label="Last name" 
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
                    <span>Enter your last name.</span>
                    <DangerousSharp
                      fontSize="small"
                      className="signupForm__reportIcon"
                    />
                  </div>
                }
              </div>

              <h4 className='signupForm__section'>Account Security</h4>

              <div className="signupForm__inputContainer">
                <TextField 
                  label="Email Address" 
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
                    <span>Enter an email.</span>
                    <DangerousSharp
                      fontSize="small"
                      className="signupForm__reportIcon"
                    />
                  </div>
                }
              </div>

              <div className='signupForm__inputContainer'>
                <TextField 
                  label="Password" 
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
                    <span>Enter a password</span>
                    <DangerousSharp
                      fontSize="small"
                      className="signupForm__reportIcon"
                    />
                  </div>
                }
                <h5>Create a password 8 to 25 characters long that includes at least 1 uppercase and 1 lowercase letter, 1 number and 1 special character like an exclamation point or asterisk.</h5>
              </div>
              
              <h4 className='signupForm__rewards'> 
                Collect more Stars & Earn Rewards
              </h4>
              <span className='signupForm__span'>
                Email is a great way to know about offers and what's new from Starbucks.
              </span>
              <FormSubmit name='Create account' type='submit'>Sign up</FormSubmit>
            </form>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;