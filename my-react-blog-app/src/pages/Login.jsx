import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../SupabaseClient"

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
            <h1>Log into your account</h1>
            <form id="login-container" onSubmit={handleSubmit}>
                <label htmlFor="l-email">Enter your email:<input disabled={loading} id="l-email" type="text" value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value) }} /></label><br />
                <label htmlFor="l-pass">Enter your password:<input disabled={loading} id="l-pass" type="text" value={loginPass} onChange={(e) => { setLoginPass(e.target.value) }} /></label><br />
                <button type="submit" disabled={loading}>{loading ? "Loading" : "Log in"}</button><p>Don't have an account? <Link to="/signup">signup</Link></p>
            </form>
        </>
    )
}
export default Login