import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { signup } from '../../actions/sessionActions';
import ClassNames from 'classnames';
import { useHistory } from 'react-router-dom';
import './signup.module.css';

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string(),
  password2: yup
    .string()
    .oneOf([yup.ref('password'), null], 'passwords must match'),
});

export default function SignupForm({ splashBtn }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const [backendErrors, setBackendErrors] = useState({
    email: '',
    username: '',
    password: '',
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (user) => {
    dispatch(signup(user)).then((res) => {
      if (res.errors) {
        setBackendErrors({
          email: res.errors?.email,
          username: res.errors?.username,
          password: res.errors?.password,
        });
      }
    });
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
                    errorInput:
                      errors.username?.message || backendErrors.email,
                  })}
                  {...register('username')}
                />
                <p className="errorMsg">{errors.username?.message}</p>
                <p className="errorMsg">{backendErrors.username}</p>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  className={ClassNames({
                    errorInput:
                      errors.email?.message || backendErrors.email,
                  })}
                  type="email"
                  {...register('email')}
                />
                <p className="errorMsg">{errors.email?.message}</p>
                <p className="errorMsg">{backendErrors.email}</p>
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  className={ClassNames({
                    errorInput:
                      errors.password?.message ||
                      backendErrors.password,
                  })}
                  type="password"
                  placeholder="At least 8 characters"
                  {...register('password')}
                />
                <p className="errorMsg">{errors.password?.message}</p>
                <p className="errorMsg">{backendErrors.password}</p>
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
