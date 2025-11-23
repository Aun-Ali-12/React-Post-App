import { useState } from "react";
import { supabase } from "../SupabaseClient";
import { Link, useNavigate } from "react-router-dom";
import formImage from '../assets/form.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faUsers, faUser } from "@fortawesome/free-solid-svg-icons";


function CreateAcc() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const capitalLetter = /[A-Z]/
    const specialChar = /[!@#$%^&*]/
    // on submit 
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault()
        SignUp()
    }

    //set pass value onchange 
    const validatePass = (e) => {
        const pass = e.target.value
        setPassword(pass)
        console.log(password);
    }

    //supabase signup function logic:
    async function SignUp() {
        let splitName = username.trim().split(" ") //removes extra space and split text into array 

        //formats name:
        let formatName = (splitName.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())).join(" ")


        //creating user account
        try {

            // validating that all fields should be filled 
            if (!email || !password || !username) {
                alert('Fill out all fields!')
                return
            }

            //password validation
            if (!capitalLetter.test(password)) {
                alert("Enter atleast one capital letter")
                return
            }
            if (!specialChar.test(password)) {
                alert("Enter atleast one special character")
                return
            }
            setLoading(true)

            const { error } = await supabase.auth.signUp({
                email: email.trim().toLowerCase(),
                password: password.trim(),
                options: {
                    data: {
                        user_name: formatName
                    }
                }
            })
            if (error) {
                alert(error)
                setLoading(false)
                return
            }
            //adding user to userinfo table just after account creation:
            try {
                //fetch session first:
                const { data } = await supabase.auth.getSession()
                if (!data) {
                    return
                }
                //inserting user in user_info table
                const { error } = await supabase
                    .from('user_info')
                    .insert({ user_id: data.session.user.id, user_name: data.session.user.user_metadata.user_name })
                if (error) {
                    console.log(error.message);
                    return
                }
            }
            catch (err) {
                console.log(err);
            }
            alert("Account created successfully")
            navigate("/")
            setEmail("")
            setPassword("")
        }
        catch (err) {
            alert(err)
        }

    }
    return (
        <>
            {/* Overall container */}
            <div className="flex flex-col lg:flex-row xl:flex-row justify-center items-center h-screen bg-gray-100 animate-leftSlide">


                {/* Form Section */}
                <div className="flex flex-col justify-center items-center w-full lg:w-[40vw] xl:w-1/2 h-full px-8 py-10 gap-4 bg-white rounded-md text-black">
                    {/* Form heading */}
                    <FontAwesomeIcon
                        icon={faUsers}
                        className="text-blue-600 text-4xl lg:text-4xl xl:text-5xl mb-2"
                    />
                    <h1 className="text-2xl lg:text-4xl xl:text-5xl font-bold capitalize mb-6 text-center">
                        Create your account
                    </h1>

                    {/* Form fields */}
                    <form
                        id="login-container"
                        onSubmit={handleSubmit}
                        className="flex flex-col items-center w-full max-w-sm lg:max-w-sm xl:max-w-md"
                    >
                        <div className="flex items-center gap-3 w-full mb-4">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="text-blue-600 text-lg"
                            />
                            <input
                                disabled={loading}
                                id="l-email"
                                type="text"
                                placeholder="Enter your name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="outline-none border-2 border-gray-300 w-full rounded px-2 py-1 text-md focus:outline-none focus:border-blue-500 transition-all duration-300"
                            />
                        </div>
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={validatePass}
                                className="outline-none border-2 border-gray-300 w-full rounded px-2 py-1 text-md focus:outline-none focus:border-blue-500 transition-all duration-300"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 w-full py-2 rounded-md text-white font-semibold hover:bg-blue-600 transition-all"
                        >
                            {loading ? "creating your account..." : "Sign up"}
                        </button>

                        <p className="mt-4 text-center">
                            already have an account?{" "}
                            <Link to="/" className="text-blue-700 hover:underline">
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
                {/* Image Section */}
                <div className="hidden lg:flex xl:flex lg:w-[60vw] w-1/2 h-full">
                    <img
                        src={formImage}
                        alt="Login image"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </>
    )
}

export default CreateAcc