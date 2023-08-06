import React from 'react'
import './Signup.css'
import { Link } from 'react-router-dom'

function Signup() {
  return (
    <div className='signup__container'>
      <div className="signup__container__box">
        <h1>Instagram</h1>
        <div className="signup__container__box__subbox">
          <input type="text" className='signup__container__box__subbox__input' placeholder=' '/>
          <label htmlFor="" className='signup__container__box__subbox__label'>Name</label>
        </div>
        <div className="signup__container__box__subbox">
          <input type="email" className='signup__container__box__subbox__input' placeholder=' '/>
          <label htmlFor="" className='signup__container__box__subbox__label'>Email Address</label>
        </div>
        <div className="signup__container__box__subbox">
          <input type="password" className='signup__container__box__subbox__input' placeholder=' '/>
          <label htmlFor="" className='signup__container__box__subbox__label'>Password</label>
        </div>
        <div className="signup__container__box__subbox">
          <button>Sign up</button>
        </div>
      </div>

      <div className="signup__container__box">
        <p>Already have an account? <Link to='/' className='signup__hyperlinks'>Sign in</Link></p>
      </div>
    </div>
  )
}

export default Signup