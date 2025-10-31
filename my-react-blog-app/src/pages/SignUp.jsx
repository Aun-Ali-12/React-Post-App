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

    // on submit 
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault()
        SignUp()
    }

    //supabase signup function logic:
    async function SignUp() {
        let splitName = username.trim().split(" ") //removes extra space and split text into array 

        //formats name:
        let formatName = (splitName.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())).join(" ")


        //creating user account
        try {
            if (!email || !password || !username) {
                alert('Fill out all fields!')
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
            {/* overall form parent  */}

            <div className="flex flex-col justify-center items-center h-screen bg-gray-10">
                {/* image div  */}

                <div className="hidden md:block"><img src={formImage} alt="" /></div>
                {/* form all content  */}
                <div className="bg-white-500 w-fixed h-fixed px-4 py-8 flex flex-col items-center gap-4 rounded-md shadow-md text-black ">
                    {/* form heading */}
                    <FontAwesomeIcon icon={faUsers} className="text-blue-600 text-3xl" />
                    <h1 className="text-2xl font-bold capitalize">Create your account</h1>
                    <form onSubmit={handleSubmit} id="form-container">
                        <div className="flex items-center gap-3 w-full"><FontAwesomeIcon icon={faUser} className="text-blue-600 text-lg" /><input disabled={loading} id="name" type="text" placeholder="Enter your username" value={username} onChange={(e) => { setUsername(e.target.value) }} className="border-2 border-grey-200 w-full rounded px-2 text-md focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in" /></div><br />
                        <div className="flex items-center gap-3 w-full"><FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-lg" /><input disabled={loading} id="email" type="text" placeholder="Enter your email" value={email} onChange={(e) => { setEmail(e.target.value) }} className="border-2 border-grey-200 w-full rounded px-2 text-md focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in" /></div><br />
                        <div className="flex items-center gap-3 w-full"><FontAwesomeIcon icon={faLock} className="text-blue-600 text-lg" /><input disabled={loading} id="pass" type="text" placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value) }} className="border-2 border-grey-200 w-full rounded px-2 text-md focus:outline-none focus:border-blue-500 transition-all duration-300 ease-in" /></div><br />
                        <button type="submit" disabled={loading} className="bg-blue-500 w-full p-2 rounded-md text-white">{loading ? "Creating your account.." : "Signup"}</button><p>Already have an account? <Link to="/" className="text-blue-700">login</Link></p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CreateAcc