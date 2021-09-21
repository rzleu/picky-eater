import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { login } from '../../actions/sessionActions';
import ClassNames from 'classnames';

const schema = yup.object().shape({
  username: yup.string().required(),
  // email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

export default function LoginForm({ splashBtn }) {
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
    console.log(user);
    dispatch(login(user));
  };

  return (
    <div>
      {openModal && (
        <>
          <div className="maskBG" />
          <div className="formContainer">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h3>Sign In</h3>
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
                <label htmlFor="password">Password</label>
                <input
                  className={ClassNames({
                    errorInput: errors.username?.message,
                  })}
                  type="password"
                  {...register('password')}
                />
                <p className="errorMsg">{errors.password?.message}</p>
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
        Log In
      </button>
    </div>
  );
}
