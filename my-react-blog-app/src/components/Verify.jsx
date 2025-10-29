import { useEffect, useState } from "react"
import { supabase } from "../SupabaseClient"
import { useNavigate } from "react-router-dom"

function Verify() {

    const [checking, setChecking] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        async function CheckAuth() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession()

                if (!session) {
                    navigate("/")
                } else {
                    console.log("User already Loggedin");
                }
                setChecking(false)
            } catch (err) {
                alert(err)
            }
        }
        CheckAuth()
    }, [])
    if (checking) return <p>Loading...</p>;
    return null;
}


export default Verify