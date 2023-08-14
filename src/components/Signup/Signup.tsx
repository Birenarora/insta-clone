import React, { ChangeEvent, useState } from 'react'
import './Signup.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Alert, Snackbar } from '@mui/material'

type FormData = {
  input_name: string,
  input_email: string,
  input_password: string
}
// type FormData = {
//   [key: string]: any,
// }

type FormDataError = {
  input_name_error: string,
  input_email_error: string,
  input_password_error: string
}

function Signup() {

  const [formData, setFormData] = useState<FormData>({input_name: '', input_email: '', input_password: ''})
  const [formDataError, setFormDataError] = useState<FormDataError>({input_name_error: '', input_email_error: '', input_password_error: ''})
  const [formSubmitLoader, setFormSubmitLoader] = useState(false)
  const [alertMessage, setAlertMessage] = useState({value: false, type: '', message: ''})
  const navigate = useNavigate()

  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name as keyof FormData

    setFormData((prevData) => ({...prevData, [name]: value}))

    validateForm(name, value)
  }

  const validateForm = (fieldName: keyof FormData, value: string) => {
    let error = ''

    switch(fieldName) {
      case 'input_name':
        if (value === '') {
          error = 'Name cannot be empty.'
        }
        break;

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

      axios.post('/signup', {
        name: formData.input_name,
        email: formData.input_email,
        password: formData.input_password
      },).then((res) => {
        // console.log(res.data);
        setFormSubmitLoader(false)
        setFormData({input_name: '', input_email: '', input_password: ''})
        setAlertMessage({value: true, type: 'pass', message: res.data.message})
        
        setTimeout(() => navigate('/'), 2000)
      }).catch((e) => {
        console.log(e.message)
        setFormSubmitLoader(false)
        setAlertMessage({value: true, type: 'fail', message: e.response.data.message})
      })
    }
  }

  return (
    <div className='signup__container'>
      {alertMessage.value && 
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key={'top' + 'vertical'} open={alertMessage.value} autoHideDuration={6000} onClose={() => setAlertMessage({value: false, type: '', message: ''})}>
        <Alert onClose={() => setAlertMessage({value: false, type: '', message: ''})} severity={alertMessage.type === 'pass' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {alertMessage.message}
        </Alert>
      </Snackbar>
      }
      <div className="signup__container__box">
        <form noValidate>
          <h1>Instagram</h1>
          <div className="signup__container__box__subbox">
            <input name='input_name' type="text" className='signup__container__box__subbox__input' placeholder=' ' value={formData.input_name} onChange={handleFormData}/>
            <label htmlFor="" className='signup__container__box__subbox__label'>Name *</label>
            {<span className='form__errors'>{formDataError.input_name_error}</span>}
          </div>
          <div className="signup__container__box__subbox">
            <input name='input_email' type="email" className='signup__container__box__subbox__input' placeholder=' ' value={formData.input_email} onChange={handleFormData}/>
            <label htmlFor="" className='signup__container__box__subbox__label'>Email Address *</label>
            {<span className='form__errors'>{formDataError.input_email_error}</span>}
          </div>
          <div className="signup__container__box__subbox">
            <input name='input_password' type="password" className='signup__container__box__subbox__input' placeholder=' ' value={formData.input_password} onChange={handleFormData}/>
            <label htmlFor="" className='signup__container__box__subbox__label'>Password *</label>
            {<span className='form__errors'>{formDataError.input_password_error}</span>}
          </div>
          <div className="signup__container__box__subbox">
            <button className={`signup__submit__button ${formSubmitLoader && 'loader'}`} onClick={submitForm}>{formSubmitLoader ? '' : 'Sign up'}</button>
          </div>
        </form>
      </div>

      <div className="signup__container__box">
        <p>Already have an account? <Link to='/' className='signup__hyperlinks'>Sign in</Link></p>
      </div>
    </div>
  )
}

export default Signup