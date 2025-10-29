import { useState } from "react";
import { supabase } from "../SupabaseClient";
import { Link, useNavigate } from "react-router-dom";
import UploadProfile from "../components/ProfilePicture"

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
            <form onSubmit={handleSubmit} id="form-container">
                <h1>Create your account</h1>
                <label htmlFor="username">Enter your name:<input disabled={loading} id="name" type="text" value={username} onChange={(e) => { setUsername(e.target.value) }} /></label><br />
                <label htmlFor="email">Enter your email:<input disabled={loading} id="email" type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} /></label><br />
                <label htmlFor="pass">Enter your password:<input disabled={loading} id="pass" type="text" value={password} onChange={(e) => { setPassword(e.target.value) }} /></label><br />
                <button type="submit" disabled={loading}>{loading ? "Creating your account.." : "Signup"}</button><p>Already have an account? <Link to="/">login</Link></p>
            </form>
        </>
    )
}

export default CreateAcc