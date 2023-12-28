import axios from 'axios'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }

    const login = () => {
        const requestBody = {
            email: email,
            password: password
        }
        axios.post('http://localhost:4000/sign-in', requestBody)
            .then(res => {
                console.log(res.data)
                if(res.data.message === "Login successful"){
                    navigate(`/home`, { state:{isLoggedIn: true }})
                }
            })
    }
    return(
        <div className='bg-gradient-to-tr from-[#FC466B] to-[#3F5EFB] h-screen w-screen font-montserrat'>
        <div className="absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%]">
            <form className='form-style'>
            <p className='font-medium text-white opacity-70 text-[1.4rem] mt-0 mb-[60px] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.2)] '>
                Welcome
            </p>
            <input className='input-style'
            type="email" value={email} onChange={handleEmail}
            placeholder="Email:" />
            <input
            className="input-style" 
            type="password" value={password} onChange={handlePassword}
            placeholder="Password:" />
            <button
            className='input-style self-center
            mt-[10px] w-[150px] text-base
            hover:cursor-pointer
            active:bg-[rgba(255,255,255,0.2)] '
            type="button" onClick={login}>Login</button>

            <div className='inline mt-3 text-white'>
            Create your account <Link to='/sign-up' className='ml-1 cursor-pointer underline underline-offset-2'>here</Link>
            </div>
            </form>
            <div className='drops '>
                <div className='box-style h-[80px] w-[80px] top-[-20px] left-[-40px] z-[-1] '></div>

                <div className='box-style h-[80px] w-[80px] bottom-[-30px] right-[-10px] '></div>

                <div className='box-style h-[100px] w-[100px] bottom-[120px] right-[-50px] z-[-1] '></div>

                <div className='box-style h-[120px] w-[120px] top-[-60px] right-[-60px] '></div>

                <div className='box-style h-[60px] w-[60px] bottom-[170px] left-[90px] z-[-1] '></div>
            </div>
        </div>
        </div>
    )
}

export default Login