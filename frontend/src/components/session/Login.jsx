import React from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useDispatch } from 'react-redux';
import { login } from '../../actions/sessionActions';

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = user => dispatch(login(user));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="username">Username</label>
      <input {...register("username")} />
      <p>{errors.username?.message}</p>
      
      {/* <label htmlFor="email">Email</label>
      <input type='email' {...register("email")} />
      <p>{errors.email?.message}</p> */}

      <label htmlFor="password">Password</label>
      <input type='password' {...register("password")} />
      <p>{errors.password?.message}</p>
      
      <input type="submit" />
    </form>
  );
}


