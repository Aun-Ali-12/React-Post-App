import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../SupabaseClient"
import { useState } from "react"

function Navbar() {
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const handleLogout = async (e) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signOut()
            if (error) {
                alert(error.message)
                setLoading(false)
                return
            }
            navigate("/")
        }
        catch (err) {
            alert(err)
        }
    }

    return (
        <>
            <Link to='/profile'>Home</Link>
            <Link to='/feed'>Feed</Link>
            <button onClick={handleLogout} disabled={loading}>{loading ? "Logging out..." : "Logout"}</button>
        </>
    )

}
export default Navbar