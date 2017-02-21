import React from 'react';
import './LoginForm.css'

export default function LoginForm(props) {
  return (
    <div className="LoginForm">
      <form>
        <h3>Log In</h3>
        <label htmlFor="loginEmail" >Email</label>
        <input id="loginEmail" type="text" />

        <label htmlFor="loginPassword" >Password</label>
        <input id="loginPassword" type="password" />

        <button type="submit">GO</button>
      </form>
      <div className="spacer" />
      <form>
        <h3>Sign Up</h3>
        <label htmlFor="email" >Email</label>
        <input id="email" type="text" />

        <label htmlFor="username" >Username</label>
        <input id="username" type="text" />

        <label htmlFor="password" >Password</label>
        <input id="password" type="password" />

        <label htmlFor="confirmPassword" >Confirm Password</label>
        <input id="confirmPassword" type="password" />

        <button type="submit">GO</button>
      </form>
    </div>
  )
}
