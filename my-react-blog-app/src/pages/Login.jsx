import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../SupabaseClient"
import formImage from '../assets/form.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUsers } from "@fortawesome/free-solid-svg-icons";


function Login() {
    const [loginEmail, setLoginEmail] = useState("")
    const [loginPass, setLoginPass] = useState("")
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    //onclick login btn
    const handleSubmit = (e) => {
        e.preventDefault();
        SignIn();
    }


    //function to Signin/Login:
    async function SignIn() {
        try {
            if (!loginEmail || !loginPass) {
                alert("Fill out all the fileds!")
                return
            }
            setLoading(true)
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginEmail.trim().toLowerCase(),
                password: loginPass.trim(),
            })
            if (error) {
                alert(error.message)
                setLoading(false)
                return
            }
            navigate("/profile")
            console.log(data);
        }
        catch (err) {
            alert(err)
        }
    }
    return (
        <>
            {/* overall form parent 
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100 lg:flex-row" >
                image div 
                <div className="hidden md:block"><img className="lg:h-64 w-1/2" src={formImage} alt="" /></div>
                form all content 
                <div className="bg-white-500 w-fixed h-fixed px-4 py-8 flex flex-col items-center gap-4 rounded-md shadow-md text-black">
                    form heading
                    <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-3xl lg: text-4xl" />
                    <h1 className="text-2xl font-bold capitalize lg:text-4xl">Log into your account</h1>
                    form input and btn 
                    <form id="login-container" onSubmit={handleSubmit} className="flex flex-col items-center">
                        <div className="flex items-center gap-3 w-full"><FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-lg lg:" /><input disabled={loading} id="l-email" type="text" placeholder="Enter your email" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value) }} className="border-2 border-grey-200 w-full rounded px-2 text-md focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in lg: w-64" /></div><br />
                        <div className="flex items-center gap-3 w-full"><FontAwesomeIcon icon={faLock} className="text-blue-600 text-lg" /><input disabled={loading} id="l-pass" type="text" placeholder="Enter your password" value={loginPass} onChange={(e) => { setLoginPass(e.target.value) }} className="border-2 border-grey-200 w-full rounded px-2 text-md focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in lg: w-64" /></div><br />
                        <button type="submit" disabled={loading} className="bg-blue-500 w-full p-2 rounded-md text-white">{loading ? "Loading" : "Log in"}</button><p>Don't have an account? <Link to="/signup" className="text-blue-700 lg: w-64">signup</Link></p>
                    </form>
                </div>
            </div> */}

            {/* Overall container */}
            <div className="flex flex-col lg:flex-row xl:flex-row justify-center items-center h-screen bg-gray-100 animate-leftSlide">
                {/* Image Section */}
                <div className="hidden lg:flex xl:flex w-1/2 h-full">
                    <img
                        src={formImage}
                        alt="Login image"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Form Section */}
                <div className="flex flex-col justify-center items-center w-full lg:w-1/2 xl:w-1/2 h-full px-8 py-10 gap-4 bg-white rounded-md text-black">
                    {/* Form heading */}
                    <FontAwesomeIcon
                        icon={faUsers}
                        className="text-blue-600 text-4xl lg:text-4xl xl:text-5xl mb-2"
                    />
                    <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold capitalize mb-6 text-center">
                        Log into your account
                    </h1>

                    {/* Form fields */}
                    <form
                        id="login-container"
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center w-full max-w-sm lg:max-w-sm xl:max-w-md"
                    >
                        <div className="flex items-center gap-3 w-full mb-4">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="text-blue-600 text-lg"
                            />
                            <input
                                disabled={loading}
                                id="l-email"
                                type="email"
                                placeholder="Enter your email"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                className="outline-none border-2 border-gray-300 w-full rounded px-2 py-1 text-md focus:outline-none focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full mb-4">
                            <FontAwesomeIcon
                                icon={faLock}
                                className="text-blue-600 text-lg"
                            />
                            <input
                                disabled={loading}
                                id="l-pass"
                                type="password"
                                placeholder="Enter your password"
                                value={loginPass}
                                onChange={(e) => setLoginPass(e.target.value)}
                                className="outline-none border-2 border-gray-300 w-full rounded px-2 py-1 text-md focus:outline-none focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 w-full py-2 rounded-md text-white font-semibold hover:bg-blue-600 transition-all"
                        >
                            {loading ? "Loading..." : "Log in"}
                        </button>

                        <p className="mt-4 text-center">
                            Don't have an account?{" "}
                            <Link to="/signup" className="text-blue-700 hover:underline">
                                Signup
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

        </>
    )
}
export default Login