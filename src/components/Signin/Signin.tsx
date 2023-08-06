import React from 'react'
import './Signin.css'
import { Link } from 'react-router-dom'

function Signin() {
  return (
    <div className='signin__container'>
      <div className="signin__container__box">
        <h1>Instagram</h1>
        <div className="signin__container__box__subbox">
          <input type="email" className='signin__container__box__subbox__input' placeholder=' '/>
          <label htmlFor="" className='signin__container__box__subbox__label'>Email Address</label>
        </div>
        <div className="signin__container__box__subbox">
          <input type="password" className='signin__container__box__subbox__input' placeholder=' '/>
          <label htmlFor="" className='signin__container__box__subbox__label'>Password</label>
        </div>
        <div className="signin__container__box__subbox">
          <button>Log in</button>
        </div>
        <Link to='#' className='signin__hyperlinks'>Forgot Password?</Link>
      </div>

      <div className="signin__container__box">
        <p>Don't have an account? <Link to='/signup' className='signin__hyperlinks'>Sign up</Link></p>
      </div>
    </div>
  )
}

export default Signin