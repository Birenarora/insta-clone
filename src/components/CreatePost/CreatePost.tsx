import React, { ChangeEvent, FormEvent, FormEventHandler, useRef, useState } from 'react'
import './CreatePost.css'
import { ArrowBack, Collections } from '@mui/icons-material'
import { useOutsideClick } from '../../hooks/OutsideClick'
import { Alert, Button, Snackbar, TextField } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

type PostFormData = { 
    post_title: String, 
    post_content: String
}

type PostFormDataError = { 
    post_title_error: boolean, 
    post_content_error: boolean
}

function CreatePost({ setIsCreatePostOpen } : { setIsCreatePostOpen: (flag: boolean) => void }) {

    const [postSteps, setPostSteps] = useState(1)
    const [imageFile, setImageFile] = useState("")
    const [imageFileName, setImageFileName] = useState(null)
    const [formImageFile, setFormImageFile] = useState<Blob | string>('')
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [formData, setFormData] = useState<PostFormData>({ post_title: "", post_content: "" })
    const [formError, setFormError] = useState<PostFormDataError>({ post_title_error: false, post_content_error: false })
    const [alertMessage, setAlertMessage] = useState({value: false, type: '', message: ''})
    const navigate = useNavigate()

    const divRef = useOutsideClick(() => {
        setIsCreatePostOpen(false)
    })

    const handleDropOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleOnDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()

        let imgFile = e.dataTransfer.files[0]
        handleFile(imgFile)
        setFormImageFile(imgFile)
    }

    const handleFile = (file: Blob | null) => {
        if (file !== null) {
            // setImageFileName(file)
            setImageFile(URL.createObjectURL(file))
            setFormImageFile(file)
            setPostSteps(2)
        }
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFile(e.target.files[0])
            console.log(e.target.files[0]);
            
        }
    }

    const handleBackButton = () => {
        if (postSteps === 3) {
            setPostSteps(1)
            setImageFile("")
            setFormImageFile('')
        } else if (postSteps === 2) {
            setPostSteps(1)
            setImageFile("")
            setFormImageFile('')
        }
    }

    const handleNextButton = () => {
        if (postSteps === 2 && imageFile !== "") {
            setPostSteps(3)
        }
    }

    const handleFormData = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.name === 'post_title' && e.target.value === '') {
            setFormError({...formError, post_title_error: true})
            return
        } else if (e.target.name === 'post_content' && e.target.value === '') {
            setFormError({...formError, post_content_error: true})
            return
        } else {
            setFormError({...formError, post_title_error: false, post_content_error: false})
            setFormData({...formData, [e.target.name]: e.target.value})
        }
    }

    const validateForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (formData.post_title === '' && formData.post_content === '') {
            setFormError({...formError, post_title_error: true, post_content_error: true})
            return
        } else if (formData.post_title === '') {
            setFormError({...formError, post_title_error: true})
            return
        } else if (formData.post_content === '') {
            setFormError({...formError, post_content_error: true})
            return
        } else {
            setFormError({...formError, post_title_error: false, post_content_error: false})
        }

        const formDataLib = new FormData()
        formDataLib.append('file', formImageFile)
        formDataLib.append('upload_preset','insta_clone')
        const config = {
            headers: { "X-Requested-With": "XMLHttpRequest" },
          };
        axios.post('https://api.cloudinary.com/v1_1/dusrilpky/image/upload', formDataLib, config)
        .then((res) => {
            if (res.data) {
                axios.post('/create-post', {
                    title: formData.post_title,
                    body: formData.post_content,
                    photo: res.data.url
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('user-details') || '{}').token
                    }
                }).then((res1) => {
                    // console.log(res1.data);
                    setAlertMessage({value: true, type: 'pass', message: res1.data.message})
                    setFormData({ post_title: '', post_content: '' })

                    setTimeout(() => setIsCreatePostOpen(false), 2000)

                    window.location.reload()
                    
                }).catch((e1) => {
                    console.log(e1.message);
                    setAlertMessage({value: true, type: 'fail', message: e1.response.data.message})
                })
            }
        }).catch((e) => {
            console.log(e.message);
            setAlertMessage({value: true, type: 'fail', message: e.response.data.error.message})
        })
    }

  return (
    <div className='createpost__container'>
        {alertMessage.value && 
        <Snackbar ref={divRef} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} key={'top' + 'vertical'} open={alertMessage.value} autoHideDuration={6000} onClose={() => setAlertMessage({value: false, type: '', message: ''})}>
            <Alert onClose={() => setAlertMessage({value: false, type: '', message: ''})} severity={alertMessage.type === 'pass' ? 'success' : 'error'} sx={{ width: '100%' }}>
            {alertMessage.message}
            </Alert>
        </Snackbar>
        }
        <div ref={divRef} className="createpost__container__box">
            <div className="createpost__container__box__header" style={{ justifyContent: postSteps === 1 ? "center" : "space-between" }}>
                {
                    postSteps === 1 ?
                    <span>Create post</span>
                    :
                    <>
                        <span style={{ cursor: "pointer" }} onClick={handleBackButton}><ArrowBack /></span>
                        <span>Create post</span>
                        {postSteps === 2 ? <button onClick={handleNextButton}>Next</button> : <button style={{ visibility: "hidden" }}>Next</button>}
                    </>
                }
            </div>
            <div className="createpost__container__box__body">
                {postSteps === 1 || postSteps === 2 ? 
                <div 
                className="createpost__container__box__body__image_uploader"
                onDragOver={handleDropOver}
                onDrop={handleOnDrop}
                onClick={() => fileInputRef.current?.click()}
                >
                    {postSteps === 1 && imageFile === "" ?
                    <>
                        <Collections fontSize='large' />
                        <span>Drag photos & videos here</span>
                        <button>Select from Computer</button>
                        <input type="file"  accept='image/*' ref={fileInputRef} hidden onChange={handleFileChange}/>
                    </>
                    :
                    <img style={{ width: "100%", height: "100%" }} src={imageFile} alt="img.png" />
                    }
                </div>
                :
                <div className="createpost__container__box__body__form">
                    <form onSubmit={validateForm}>
                        <TextField error={formError.post_title_error} helperText={formError.post_title_error && 'Title cannot be empty.'} fullWidth id="standard-required" label="Title *" variant="standard" name='post_title' onChange={handleFormData} value={formData.post_title} />
                        <TextField error={formError.post_content_error} helperText={formError.post_content_error && 'Content cannot be empty.'} multiline fullWidth rows={4} id="standard-multiline-static" label="Content *" variant="standard" name='post_content' onChange={handleFormData} value={formData.post_content} />
                        <Button variant="contained" type='submit'>Submit</Button>
                    </form>
                </div>
                }
            </div>
        </div>
    </div>
  )
}

export default CreatePost