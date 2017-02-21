import React from 'react';
import './LoginForm.css'

export default function LoginForm(props) {
  const { handleChange } = props;
  return (
    <div className="LoginForm">
      <form onSubmit={props.submitLogin} name="loginForm">
        <h3>Log In</h3>
        <label htmlFor="loginEmail" >Email</label>
        <input onChange={ handleChange } value={props.loginEmail} id="loginEmail" type="text" />

        <label htmlFor="loginPassword" >Password</label>
        <input onChange={ handleChange } value={props.loginPassword} id="loginPassword" type="password" />

        <button type="submit">GO</button>
      </form>
      <div className="spacer" />
      <form onSubmit={props.submitLogin} name="signupForm">
        <h3>Sign Up</h3>
        <label htmlFor="email" >Email</label>
        <input onChange={ handleChange } value={props.email} id="email" type="text" />

        <label htmlFor="username" >Username</label>
        <input onChange={ handleChange } value={props.username} id="username" type="text" />

        <label htmlFor="password" >Password</label>
        <input onChange={ handleChange } value={props.password} id="password" type="password" />

        <label htmlFor="confirmPassword" >Confirm Password</label>
        <input onChange={ handleChange } value={props.confirmPassword} id="confirmPassword" type="password" />

        <button type="submit">GO</button>
      </form>
    </div>
  )
}
