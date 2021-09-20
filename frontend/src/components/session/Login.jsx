import React from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
});

export default function LoginForm() {
  const { register, handleSubmit, formState:{ errors } } = useForm({
    resolver: yupResolver(schema)
  });
  const onSubmit = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="username">Username</label>
      <input {...register("username")} />
      <p>{errors.username?.message}</p>
      
      <label htmlFor="username">Email</label>
      <input {...register("email")} />
      <p>{errors.email?.message}</p>

      <label htmlFor="username">Password</label>
      <input {...register("password")} />
      <p>{errors.password?.message}</p>
      
      <input type="submit" />
    </form>
  );
}