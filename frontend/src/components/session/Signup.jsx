import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { signup } from '../../actions/sessionActions';
import styles from './signup.module.css';
import ClassNames from 'classnames';

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  password2: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords must match'),
});

export default function SignupForm({ splashBtn }) {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (user) => {
    // console.log(user);
    dispatch(signup(user));
  };

  return (
    <div>
      {openModal && (
        <>
          <div className="maskBG" />
          <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3>Create Account</h3>
              <div>
                <label htmlFor="username">Username</label>
                <input
                  className={ClassNames({
                    errorInput: errors.username?.message,
                  })}
                  {...register('username')}
                />
                <p className="errorMsg">{errors.username?.message}</p>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  className={ClassNames({
                    errorInput: errors.email?.message,
                  })}
                  type="email"
                  {...register('email')}
                />
                <p className="errorMsg">{errors.email?.message}</p>
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  className={ClassNames({
                    errorInput: errors.password?.message,
                  })}
                  type="password"
                  {...register('password')}
                />
                <p className="errorMsg">{errors.password?.message}</p>
              </div>
              <div>
                <label htmlFor="password2">
                  Confirm your password
                </label>
                <input
                  className={ClassNames({
                    errorInput: errors.password2?.message,
                  })}
                  type="password"
                  {...register('password2')}
                />
                <p className="errorMsg">
                  {errors.password2?.message}
                </p>
              </div>
              <input type="submit" />
              <button onClick={() => setOpenModal(false)}>✖</button>
            </form>
          </div>
        </>
      )}
      <button
        className={splashBtn}
        onClick={() => setOpenModal(true)}
      >
        Create Account
      </button>
    </div>
  );
}
