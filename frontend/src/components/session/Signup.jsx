import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { signup } from '../../actions/sessionActions';
import styles from './signup.module.css';

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  password2: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export default function SignupForm() {
  const dispatch = useDispatch;
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
    dispatch(signup(user));
  };

  return (
    <div>
      {openModal && (
        <>
          <div className={styles.maskBG} />

          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username">Username</label>
                <input {...register('username')} />
                <p>{errors.username?.message}</p>
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" {...register('email')} />
                <p>{errors.email?.message}</p>
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input type="password" {...register('password')} />
                <p>{errors.password?.message}</p>
              </div>
              <div>
                <label htmlFor="password2">
                  Confirm your password
                </label>
                <input type="password" {...register('password2')} />
                <p>{errors.password2?.message}</p>
              </div>
              <input type="submit" />
              <button onClick={() => setOpenModal(false)}>✖</button>
            </form>
          </div>
        </>
      )}
      <button onClick={() => setOpenModal(true)}>
        Create Account
      </button>
    </div>
  );
}
