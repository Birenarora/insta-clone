import React, { ChangeEvent, useEffect, useState } from 'react'
import './ResetPassword.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Alert, Snackbar } from '@mui/material'
import axios from 'axios'
import { useStateValue } from '../../hooks/StateProvider'

type FormData = {
    input_email: string,
}

type FormDataError = {
    input_email_error: string,
}

type FormPasswordData = {
    input_password: string,
}

type FormPasswordDataError = {
    input_password_error: string,
}

function ResetPassword() {

  const [formData, setFormData] = useState<FormData>({input_email: ''})
  const [formDataError, setFormDataError] = useState<FormDataError>({input_email_error: ''})
  const [formSubmitLoader, setFormSubmitLoader] = useState(false)

  const [formPasswordData, setFormPasswordData] = useState<FormPasswordData>({input_password: ''})
  const [formPasswordDataError, setFormPasswordDataError] = useState<FormPasswordDataError>({input_password_error: ''})
  const [formPasswordSubmitLoader, setFormPasswordSubmitLoader] = useState(false)

  const [alertMessage, setAlertMessage] = useState({value: false, type: '', message: ''})
  const navigate = useNavigate()
  const { state, dispatch } = useStateValue()
  const [defaultResetPath, setDefaultResetPath] = useState(true)
  const routeParams = useParams()
  const [resetToken, setResetToken] = useState<string | undefined>('')

  useEffect(() => {
    if (Object.keys(routeParams).length === 0) {
        setDefaultResetPath(true)
        setResetToken('')
    } else {
        setDefaultResetPath(false)
        setResetToken(routeParams.token)
    }
  }, [])

  const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name as keyof FormData

    setFormData((prevData) => ({...prevData, [name]: value}))

    validateForm(name, value)
  }
  
  const handleFormPasswordData = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const name = e.target.name as keyof FormPasswordData

    setFormPasswordData((prevData) => ({...prevData, [name]: value}))

    validateFormPassword(name, value)
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

      default:
        break;
    }

    setFormDataError((prevErrors) => ({...prevErrors, [fieldName+'_error']: error}))
  }
  
  const validateFormPassword = (fieldName: keyof FormPasswordData, value: string) => {
    let error = ''

    switch(fieldName) {
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

    setFormPasswordDataError((prevErrors) => ({...prevErrors, [fieldName+'_error']: error}))
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

      axios.post('/reset-password', {
        email: formData.input_email,
      },).then((res) => {
        // console.log(res.data);
        setFormSubmitLoader(false)
        setFormData({input_email: ''})
        setAlertMessage({value: true, type: 'pass', message: res.data.response.message})
        
        // setTimeout(() => navigate('/'), 2000)
        setTimeout(() => window.location.href = '/', 1000)
      }).catch((e) => {
        console.log(e.message)
        setFormSubmitLoader(false)
        setAlertMessage({value: true, type: 'fail', message: e.response.data.message})
      })
    }
  }
  
  const submitFormPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    for (const field in formPasswordData) {
      validateFormPassword(field as keyof FormPasswordData, formPasswordData[field as keyof FormPasswordData])
    }

    const hasErrors = Object.values(formPasswordDataError).some((error) => error !== '')    
    const hasValues = Object.values(formPasswordData).some((value) => value !== '')    

    if (!hasErrors && hasValues) {
      console.log('Form submitted.');
      setFormPasswordSubmitLoader(true)

      axios.post('/new-password/', {
        password: formPasswordData.input_password,
        token: resetToken
      },).then((res) => {
        // console.log(res.data);
        setFormPasswordSubmitLoader(false)
        setFormPasswordData({input_password: ''})
        setAlertMessage({value: true, type: 'pass', message: res.data.response.message})
        
        // setTimeout(() => navigate('/'), 2000)
        setTimeout(() => window.location.href = '/', 1000)
      }).catch((e) => {
        console.log(e.message)
        setFormPasswordSubmitLoader(false)
        setAlertMessage({value: true, type: 'fail', message: e.response.data.message})
      })
    }
  }

  return (
    <div className='resetpass__container'>
      {alertMessage.value && 
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key={'top' + 'vertical'} open={alertMessage.value} autoHideDuration={6000} onClose={() => setAlertMessage({value: false, type: '', message: ''})}>
        <Alert onClose={() => setAlertMessage({value: false, type: '', message: ''})} severity={alertMessage.type === 'pass' ? 'success' : 'error'} sx={{ width: '100%' }}>
          {alertMessage.message}
        </Alert>
      </Snackbar>
      }
      {defaultResetPath ?
        <div className="resetpass__container__box">
            <form noValidate>
                <h1>Instagram</h1>
                <div className="resetpass__container__box__subbox">
                    <input name='input_email' type="email" className='resetpass__container__box__subbox__input' placeholder=' ' value={formData.input_email} onChange={handleFormData}/>
                    <label htmlFor="" className='resetpass__container__box__subbox__label'>Email Address</label>
                    {<span className='form__errors'>{formDataError.input_email_error}</span>}
                </div>
                <div className="resetpass__container__box__subbox">
                <button className={`resetpass__submit__button ${formSubmitLoader && 'loader'}`} onClick={submitForm}>{formSubmitLoader ? '' : 'Reset Password'}</button>
                </div>
            </form>
        </div>
      :
        <div className="resetpass__container__box">
            <form noValidate>
                <h1>Instagram</h1>
                <div className="resetpass__container__box__subbox">
                    <input name='input_password' type="password" className='resetpass__container__box__subbox__input' placeholder=' ' value={formPasswordData.input_password} onChange={handleFormPasswordData}/>
                    <label htmlFor="" className='resetpass__container__box__subbox__label'>Password</label>
                    {<span className='form__errors'>{formPasswordDataError.input_password_error}</span>}
                </div>
                <div className="resetpass__container__box__subbox">
                <button className={`resetpass__submit__button ${formPasswordSubmitLoader && 'loader'}`} onClick={submitFormPassword}>{formPasswordSubmitLoader ? '' : 'Update Password'}</button>
                </div>
            </form>
        </div>
      }

      <div className="resetpass__container__box">
        <p><Link to='/' className='resetpass__hyperlinks'>Go Back</Link></p>
      </div>
    </div>
  )
}

export default ResetPassword