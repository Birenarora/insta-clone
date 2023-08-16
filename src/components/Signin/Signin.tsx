import React, { ChangeEvent, useRef, useState } from 'react'
import './Signin.css'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Snackbar } from '@mui/material'
import axios from 'axios'
import { useStateValue } from '../../hooks/StateProvider'

type FormData = {
  input_email: string,
  input_password: string
}

type FormDataError = {
  input_email_error: string,
  input_password_error: string
}

function Signin() {

  const [formData, setFormData] = useState<FormData>({input_email: '', input_password: ''})
  const [formDataError, setFormDataError] = useState<FormDataError>({input_email_error: '', input_password_error: ''})
  const [formSubmitLoader, setFormSubmitLoader] = useState(false)
  const [alertMessage, setAlertMessage] = useState({value: false, type: '', message: ''})
  const navigate = useNavigate()
  const { state, dispatch } = useStateValue()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name as keyof FormData

    setFormData((prevData) => ({...prevData, [name]: value}))

    validateForm(name, value)
  }

  const validateForm = (fieldName: keyof FormData, value: string) => {
    let error = ''

    switch(fieldName) {
      case 'input_email':
        if (value === '') {
          error = 'Email cannot be empty.'
        } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(formData.input_email.toString())) {
          error = 'Invalid Email.'
        }
        break;

      case 'input_password':
        if (value === '') {
          error = 'Password cannot be empty.'
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters long'
        }
        break;

      default:
        break;
    }

    setFormDataError((prevErrors) => ({...prevErrors, [fieldName+'_error']: error}))
  }

  const submitForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    for (const field in formData) {
      validateForm(field as keyof FormData, formData[field as keyof FormData])
    }

    const hasErrors = Object.values(formDataError).some((error) => error !== '')    
    const hasValues = Object.values(formData).some((value) => value !== '')    

    if (!hasErrors && hasValues) {
      console.log('Form submitted.');
      setFormSubmitLoader(true)

      axios.post('/signin', {
        email: formData.input_email,
        password: formData.input_password
      },).then((res) => {
        // console.log(res.data);
        setFormSubmitLoader(false)
        setFormData({input_email: '', input_password: ''})
        setAlertMessage({value: true, type: 'pass', message: 'Signed In Successfully.'})

        let userData = res.data        

        localStorage.setItem('user-details', JSON.stringify(userData))

        dispatch({
          type: 'SET_USER',
          payload: userData
        })
        
        // setTimeout(() => navigate('/'), 2000)
        setTimeout(() => window.location.reload(), 1000)
      }).catch((e) => {
        console.log(e.message)
        setFormSubmitLoader(false)
        setAlertMessage({value: true, type: 'fail', message: e.response.data.message})
      })
    }
  }

  return (
    <div className='signin__container'>
      {alertMessage.value && 
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key={'top' + 'vertical'} open={alertMessage.value} autoHideDuration={6000} onClose={() => setAlertMessage({value: false, type: '', message: ''})}>
        <Alert onClose={() => setAlertMessage({value: false, type: '', message: ''})} severity={alertMessage.type === 'pass' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {alertMessage.message}
        </Alert>
      </Snackbar>
      }
      <div className="signin__container__box">
        <form noValidate>
          <h1>Instagram</h1>
            <div className="signin__container__box__subbox">
              <input ref={inputRef} name='input_email' type="email" className='signin__container__box__subbox__input' placeholder=' ' value={formData.input_email} onChange={handleFormData}/>
              <label htmlFor="input_email" className='signin__container__box__subbox__label' onClick={() => inputRef.current?.click()}>Email Address</label>
              {<span className='form__errors'>{formDataError.input_email_error}</span>}
            </div>
            <div className="signin__container__box__subbox">
              <input name='input_password' type="password" className='signin__container__box__subbox__input' placeholder=' ' value={formData.input_password} onChange={handleFormData}/>
              <label htmlFor="" className='signin__container__box__subbox__label'>Password</label>
              {<span className='form__errors'>{formDataError.input_password_error}</span>}
            </div>
            <div className="signin__container__box__subbox">
            <button className={`signin__submit__button ${formSubmitLoader && 'loader'}`} onClick={submitForm}>{formSubmitLoader ? '' : 'Log In'}</button>
            </div>
            <Link to='/reset' className='signin__hyperlinks'>Forgot Password?</Link>
        </form>
      </div>

      <div className="signin__container__box">
        <p>Don't have an account? <Link to='/signup' className='signin__hyperlinks'>Sign up</Link></p>
      </div>
    </div>
  )
}

export default Signin